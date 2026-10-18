def get_token(client, email, password):
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return res.json()["access_token"]

def test_admin_dashboard_stats(client):
    token = get_token(client, "admin@bgverify.ai", "AdminPass123!")
    res = client.get("/api/v1/dashboard/stats", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "ADMIN"
    assert data["total_organizations"] >= 2
    assert "metrics" in data
    assert data["metrics"]["total_verifications"] >= 3
    assert len(data["recent_verifications"]) >= 1

def test_hr_dashboard_stats(client):
    token = get_token(client, "hr@acme-corp.com", "HrPass123!")
    res = client.get("/api/v1/dashboard/stats", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "ORG_HR"
    assert data["organization_name"] == "Acme Global Corporation"
    assert "metrics" in data
    assert data["metrics"]["completed_count"] >= 1
    assert data["metrics"]["manual_review_count"] >= 1

def test_candidate_dashboard_stats(client):
    token = get_token(client, "candidate@example.com", "CandidatePass123!")
    res = client.get("/api/v1/dashboard/stats", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "CANDIDATE"
    assert "assigned_verifications" in data

def test_recent_activity_search_and_filter(client):
    token = get_token(client, "admin@bgverify.ai", "AdminPass123!")
    res = client.get("/api/v1/dashboard/recent-activity?search=John", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert any("John" in item["candidate_name"] for item in data)
