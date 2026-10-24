import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import Base, get_db
from app.main import app
from app.seed import seed

TEST_DATABASE_URL = "sqlite:///./test_bgverify.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    # Use standard app for tests
    yield
    Base.metadata.drop_all(bind=test_engine)
    if os.path.exists("./test_bgverify.db"):
        try:
            os.remove("./test_bgverify.db")
        except Exception:
            pass

@pytest.fixture
def client():
    # Use standard test client against app
    with TestClient(app) as test_client:
        yield test_client
