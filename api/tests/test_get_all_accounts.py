from fastapi.testclient import TestClient
from main import app
from queries.accounts import AccountQueries
from routers.authenticator import authenticator
from datetime import datetime


client = TestClient(app)


class TestGetAllAccounts:
    def get_accounts(self):
        result = [
            {
            "account_id": 1,
            "email": "string",
            "username": "string",
            "first_name": "string",
            "last_name": "string",
            "profile_picture_url": "string",
            "banner_url": "string",
            "signup_date": "2023-12-12T01:26:47.997Z"
            }
        ]
        return result


def test_get_all_accounts():
    app.dependency_overrides[AccountQueries] = TestGetAllAccounts

    response = client.get("/api/accounts/")

    expected = [
        {
        "account_id": 1,
        "email": "string",
        "username": "string",
        "first_name": "string",
        "last_name": "string",
        "profile_picture_url": "string",
        "banner_url": "string",
        "signup_date":  datetime.today().strftime('%Y-%m-%d %H:%M:%S')
        }
    ]


    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected
