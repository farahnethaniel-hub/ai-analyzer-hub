"""Public pages load for anonymous visitors."""

import pytest
import requests

PAGES = ["/", "/cv-analyzer", "/repo-analyzer", "/instagram-analyzer"]


@pytest.mark.parametrize("path", PAGES)
def test_page_loads(http: requests.Session, base_url: str, path: str) -> None:
    response = http.get(f"{base_url}{path}", timeout=30)

    assert response.status_code == 200
    assert "text/html" in response.headers.get("content-type", "")
    assert "AI Analyzer Hub" in response.text


def test_pages_are_hebrew_rtl(http: requests.Session, base_url: str) -> None:
    html = http.get(base_url, timeout=30).text

    assert 'lang="he"' in html
    assert 'dir="rtl"' in html


def test_unknown_page_returns_404(http: requests.Session, base_url: str) -> None:
    response = http.get(f"{base_url}/this-page-does-not-exist", timeout=30)

    assert response.status_code == 404
