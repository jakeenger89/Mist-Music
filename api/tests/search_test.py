from fastapi.testclient import TestClient
from main import app
from queries.accounts import AccountQueries
from routers.authenticator import authenticator
# from dateutil import parser


client = TestClient(app)


class TestSearchUser:
    def search_accounts(self, search_term):
        result = [
            {
                "account_id": 1,
                "email": "string",
                "username": "jake",
                "first_name": "string",
                "last_name": "string",
                "profile_picture_url": "string",
                "banner_url": "string",
                "signup_date": "2023-12-11T23:18:55.039+00:00"
            },
            {
                "account_id": 2,
                "email": "string",
                "username": "jill",
                "first_name": "string",
                "last_name": "string",
                "profile_picture_url": "string",
                "banner_url": "string",
                "signup_date": "2023-12-11T23:18:55.039+00:00"
            }
        ]
        return result


def test_search_accounts():
    app.dependency_overrides[AccountQueries] = TestSearchUser
    response = client.get("/api/search_accounts?search_term=j")

    expected = [
        {
            "account_id": 1,
            "email": "string",
            "username": "jake",
            "first_name": "string",
            "last_name": "string",
            "profile_picture_url": "string",
            "banner_url": "string",
            "signup_date": "2023-12-11T23:18:55.039+00:00"
        },
        {
                "account_id": 2,
                "email": "string",
                "username": "jill",
                "first_name": "string",
                "last_name": "string",
                "profile_picture_url": "string",
                "banner_url": "string",
                "signup_date": "2023-12-11T23:18:55.039+00:00"
        }
    ]


    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected
