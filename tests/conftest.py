"""Shared fixtures for the AI Analyzer Hub API test suite.

The suite talks to a running deployment over HTTP, so it tests the real stack:
Next.js routing, Clerk middleware, input validation and error responses.

Environment variables
---------------------
BASE_URL            Deployment to test. Defaults to the production site.
CLERK_SECRET_KEY    Clerk backend key. Needed only for the authenticated tests.
CLERK_TEST_USER_ID  A dedicated Clerk test user (user_...). Needed with the key.
RUN_LIVE_AI         Set to "1" to run the tests that call Gemini (uses quota).
VERCEL_AUTOMATION_BYPASS_SECRET
                    Lets the suite reach preview deployments that sit behind Vercel
                    Authentication (Project Settings > Deployment Protection).
"""

from __future__ import annotations

import os
from collections.abc import Iterator

import pytest
import requests

DEFAULT_BASE_URL = "https://ai-analyzer-hub.vercel.app"
CLERK_API = "https://api.clerk.com/v1"
TIMEOUT = 30


def pytest_configure(config: pytest.Config) -> None:
    config.addinivalue_line("markers", "auth: needs a Clerk test session (CLERK_SECRET_KEY + CLERK_TEST_USER_ID)")
    config.addinivalue_line("markers", "live: calls the real AI model and spends quota (RUN_LIVE_AI=1)")


def pytest_collection_modifyitems(config: pytest.Config, items: list[pytest.Item]) -> None:
    if os.getenv("RUN_LIVE_AI") == "1":
        return
    skip_live = pytest.mark.skip(reason="live AI test; set RUN_LIVE_AI=1 to run")
    for item in items:
        if "live" in item.keywords:
            item.add_marker(skip_live)


@pytest.fixture(scope="session")
def base_url() -> str:
    return os.getenv("BASE_URL", DEFAULT_BASE_URL).rstrip("/")


def deployment_headers() -> dict[str, str]:
    """Headers every request needs to reach the deployment itself (not the app's own auth)."""
    headers = {"User-Agent": "ai-analyzer-hub-api-tests"}
    bypass = os.getenv("VERCEL_AUTOMATION_BYPASS_SECRET")
    if bypass:
        headers["x-vercel-protection-bypass"] = bypass
    return headers


@pytest.fixture(scope="session", autouse=True)
def deployment_is_reachable(base_url: str) -> None:
    """Fail fast with one clear message when Vercel's login wall answers instead of the app."""
    response = requests.get(base_url, headers=deployment_headers(), timeout=TIMEOUT)
    login_wall = "vercel.com/login" in response.url or "vercel.com/sso" in response.url or (
        response.status_code == 401 and "vercel" in response.text.lower()
    )
    if login_wall or "AI Analyzer Hub" not in response.text:
        pytest.exit(
            f"{base_url} did not serve the app (likely behind Vercel Authentication). "
            "Set VERCEL_AUTOMATION_BYPASS_SECRET or test the production URL.",
            returncode=2,
        )


@pytest.fixture(scope="session")
def http() -> Iterator[requests.Session]:
    """An anonymous client: no cookies, no app auth header."""
    with requests.Session() as session:
        session.headers.update(deployment_headers())
        yield session


class ClerkTestSession:
    """Opens a short-lived Clerk session for the test user and hands out fresh session tokens.

    Clerk session tokens live for about a minute, so every request asks for a new one
    instead of reusing a token that may have expired mid-run.
    """

    def __init__(self, secret_key: str, user_id: str) -> None:
        self._api = requests.Session()
        self._api.headers["Authorization"] = f"Bearer {secret_key}"
        response = self._api.post(f"{CLERK_API}/sessions", json={"user_id": user_id}, timeout=TIMEOUT)
        if response.status_code >= 400:
            raise RuntimeError(f"Clerk refused to open a test session ({response.status_code}): {response.text}")
        self.session_id = response.json()["id"]

    def token(self) -> str:
        response = self._api.post(f"{CLERK_API}/sessions/{self.session_id}/tokens", timeout=TIMEOUT)
        response.raise_for_status()
        return response.json()["jwt"]

    def close(self) -> None:
        self._api.post(f"{CLERK_API}/sessions/{self.session_id}/revoke", timeout=TIMEOUT)
        self._api.close()


@pytest.fixture(scope="session")
def clerk_session() -> Iterator[ClerkTestSession]:
    secret_key = os.getenv("CLERK_SECRET_KEY")
    user_id = os.getenv("CLERK_TEST_USER_ID")
    if not secret_key or not user_id:
        pytest.skip("authenticated tests need CLERK_SECRET_KEY and CLERK_TEST_USER_ID")
    session = ClerkTestSession(secret_key, user_id)
    yield session
    session.close()


@pytest.fixture
def api(base_url: str, clerk_session: ClerkTestSession):
    """Calls an API route as the signed-in test user. Usage: api("/api/analyze", {...})."""

    def call(path: str, payload: object | None = None, *, raw_body: str | None = None) -> requests.Response:
        headers = {**deployment_headers(), "Authorization": f"Bearer {clerk_session.token()}"}
        if raw_body is not None:
            headers["Content-Type"] = "application/json"
            return requests.post(f"{base_url}{path}", data=raw_body, headers=headers, timeout=TIMEOUT)
        return requests.post(f"{base_url}{path}", json=payload, headers=headers, timeout=120)

    return call


def error_message(response: requests.Response) -> str:
    """Every API failure is JSON shaped like {"error": "<message for the user>"}."""
    assert response.headers.get("content-type", "").startswith("application/json"), response.text[:200]
    body = response.json()
    assert isinstance(body.get("error"), str) and body["error"].strip(), body
    return body["error"]
