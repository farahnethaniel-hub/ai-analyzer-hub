"""End-to-end analyses against the real AI model. Opt-in: RUN_LIVE_AI=1 (spends Gemini quota)."""

import re

import pytest

pytestmark = [pytest.mark.auth, pytest.mark.live]

CV = """Nethaniel Farah - Computer Science B.Sc. student at HIT, GPA 80.
Skills: Python, Java, C#, C++, TypeScript, Git, REST APIs.
Built AI Analyzer Hub, a Next.js web app with server-side APIs, input validation and error handling."""
JOB = """Automation Developer Student. Extend a Python integration test framework covering APIs,
services and databases. Requirements: Python, B.Sc. student with GPA 80+, AI tools for coding."""


def assert_report(body: dict, sections: list[str]) -> None:
    assert set(body) >= {"report", "score"}
    assert isinstance(body["report"], str) and len(body["report"]) > 200
    for section in sections:
        assert re.search(rf"^##\s*{re.escape(section)}", body["report"], re.MULTILINE), f"missing section: {section}"
    assert "SCORE:" not in body["report"], "the raw score line should be stripped from the report"
    assert body["score"] is None or 0 <= body["score"] <= 100


def test_cv_analysis_returns_scored_report(api) -> None:
    response = api("/api/analyze", {"cvText": CV, "jobDescription": JOB})

    assert response.status_code == 200, response.text[:300]
    assert_report(response.json(), ["סיכום", "חוזקות"])


def test_instagram_analysis_returns_scored_report(api) -> None:
    response = api("/api/instagram", {"username": "@tlv_jewelry", "niche": "jewelry", "bio": "Handmade silver jewelry"})

    assert response.status_code == 200, response.text[:300]
    assert_report(response.json(), ["רושם ראשוני", "ביו מוצע"])
