"""Every analysis endpoint is closed to anonymous callers and only accepts POST."""

import pytest
import requests

from conftest import error_message

ENDPOINTS = {
    "/api/analyze": {"cvText": "x" * 100, "jobDescription": "Python developer with REST API experience"},
    "/api/analyze-repo": {"repoUrl": "https://github.com/vercel/next.js"},
    "/api/instagram": {"username": "some_business", "bio": "Handmade jewelry from Tel Aviv"},
}


@pytest.mark.parametrize("path, payload", ENDPOINTS.items(), ids=list(ENDPOINTS))
def test_anonymous_post_is_rejected(http: requests.Session, base_url: str, path: str, payload: dict) -> None:
    response = http.post(f"{base_url}{path}", json=payload, timeout=30)

    assert response.status_code == 401
    assert error_message(response)


@pytest.mark.parametrize("path", ENDPOINTS)
def test_forged_token_is_rejected(http: requests.Session, base_url: str, path: str) -> None:
    response = http.post(
        f"{base_url}{path}",
        json=ENDPOINTS[path],
        headers={"Authorization": "Bearer not-a-real-session-token"},
        timeout=30,
    )

    assert response.status_code == 401


@pytest.mark.parametrize("path", ENDPOINTS)
def test_get_is_not_allowed(http: requests.Session, base_url: str, path: str) -> None:
    response = http.get(f"{base_url}{path}", timeout=30)

    assert response.status_code == 405
