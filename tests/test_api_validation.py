"""Signed-in requests with bad input are refused with a clear 4xx before any AI call is made."""

import pytest

from conftest import error_message

pytestmark = pytest.mark.auth

VALID_CV = "Nethaniel Farah. Computer Science student. Python, Java, C++, REST APIs, Git. " * 2
VALID_JOB = "Automation developer student: Python integration tests for APIs and databases."


# --- CV Analyzer -----------------------------------------------------------------------


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"cvText": "", "jobDescription": VALID_JOB},
        {"cvText": "too short to be a CV", "jobDescription": VALID_JOB},
        {"cvText": " " * 500, "jobDescription": VALID_JOB},  # whitespace only, e.g. a scanned PDF
        {"cvText": VALID_CV},
        {"cvText": VALID_CV, "jobDescription": "dev"},
    ],
    ids=["empty-body", "empty-cv", "short-cv", "whitespace-cv", "missing-job", "short-job"],
)
def test_cv_analyzer_rejects_bad_input(api, payload: dict) -> None:
    response = api("/api/analyze", payload)

    assert response.status_code == 400
    assert error_message(response)


def test_cv_analyzer_rejects_malformed_json(api) -> None:
    response = api("/api/analyze", raw_body="{not valid json")

    assert response.status_code == 400
    assert error_message(response)


# --- Repo Analyzer ---------------------------------------------------------------------


@pytest.mark.parametrize(
    "repo_url",
    ["", "not a url", "https://github.com/", "https://github.com/only-owner", "https://github.com/a b/c d"],
    ids=["empty", "plain-text", "no-owner", "no-repo", "spaces"],
)
def test_repo_analyzer_rejects_invalid_url(api, repo_url: str) -> None:
    response = api("/api/analyze-repo", {"repoUrl": repo_url})

    assert response.status_code == 400
    assert error_message(response)


def test_repo_analyzer_reports_missing_repo(api) -> None:
    response = api("/api/analyze-repo", {"repoUrl": "https://github.com/farahnethaniel-hub/repo-that-does-not-exist-404"})

    assert response.status_code == 404
    assert error_message(response)


# --- Instagram Analyzer ----------------------------------------------------------------


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"username": "", "bio": "Handmade jewelry"},
        {"username": "@"},  # the leading @ is stripped, leaving nothing
        {"username": "some_business"},  # no bio and no content to analyze
    ],
    ids=["empty-body", "empty-username", "only-at-sign", "no-bio-or-content"],
)
def test_instagram_analyzer_rejects_bad_input(api, payload: dict) -> None:
    response = api("/api/instagram", payload)

    assert response.status_code == 400
    assert error_message(response)
