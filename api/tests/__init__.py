from fastapi.testclient import TestClient
from main import app
from queries.accounts import AccountQueries

cilent = TestClient(app)
