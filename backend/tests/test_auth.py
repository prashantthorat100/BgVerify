def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "BGVerify.ai"

def test_admin_login_success(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@bgverify.ai",
        "password": "AdminPass123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" == "access_token" in data
    assert data["email"] == "admin@bgverify.ai"
    assert data["role"] == "ADMIN"

def test_hr_login_success(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "hr@acme-corp.com",
        "password": "HrPass123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "ORG_HR"
    assert data["organization_id"] is not None
    assert data["organization_name"] == "Acme Global Corporation"

def test_invalid_password(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@bgverify.ai",
        "password": "WrongPassword!"
    })
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_current_user_me_endpoint(client):
    # Log in
    login_res = client.post("/api/v1/auth/login", json={
        "email": "admin@bgverify.ai",
        "password": "AdminPass123!"
    })
    token = login_res.json()["access_token"]
    
    # Query /me
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "admin@bgverify.ai"

def test_register_candidate(client):
    import uuid
    uid = uuid.uuid4().hex[:8]
    res = client.post("/api/v1/auth/register", json={
        "email": f"candidate_{uid}@test.com",
        "password": "Password123!",
        "full_name": "New Candidate",
        "role": "CANDIDATE",
        "phone": "+1-555-0199"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "CANDIDATE"
    assert "access_token" in data["token"]

def test_register_org_hr(client):
    import uuid
    uid = uuid.uuid4().hex[:8]
    res = client.post("/api/v1/auth/register", json={
        "email": f"hr_{uid}@techstartup.com",
        "password": "Password123!",
        "full_name": "Tech HR Lead",
        "role": "ORG_HR",
        "organization_name": f"Startup {uid}"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "ORG_HR"
    assert data["token"]["organization_name"] == f"Startup {uid}"

def test_register_admin(client):
    import uuid
    uid = uuid.uuid4().hex[:8]
    res = client.post("/api/v1/auth/register", json={
        "email": f"admin_{uid}@security.com",
        "password": "Password123!",
        "full_name": "Platform Admin",
        "role": "ADMIN"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "ADMIN"
