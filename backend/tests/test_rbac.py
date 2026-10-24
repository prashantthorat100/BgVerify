def get_token_for(client, email, password):
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return res.json()["access_token"]

def test_admin_can_list_organizations(client):
    admin_token = get_token_for(client, "admin@bgverify.ai", "AdminPass123!")
    res = client.get("/api/v1/organizations/", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    orgs = res.json()
    assert len(orgs) >= 2
    assert any(o["slug"] == "acme-global" for o in orgs)

def test_hr_cannot_list_all_organizations(client):
    hr_token = get_token_for(client, "hr@acme-corp.com", "HrPass123!")
    res = client.get("/api/v1/organizations/", headers={"Authorization": f"Bearer {hr_token}"})
    assert res.status_code == 403
    assert "Operation not permitted" in res.json()["detail"]

def test_candidate_cannot_access_organizations(client):
    cand_token = get_token_for(client, "candidate@example.com", "CandidatePass123!")
    res = client.get("/api/v1/organizations/", headers={"Authorization": f"Bearer {cand_token}"})
    assert res.status_code == 403
