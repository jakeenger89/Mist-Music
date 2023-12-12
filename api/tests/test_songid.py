from fastapi.testclient import TestClient
from main import app
from queries.accounts import AccountQueries
from routers.authenticator import authenticator

client = TestClient(app)


class TestSongQueries:
    def test_get_song_by_id(self):

        song_id = 1

        response = client.get(f"/api/songs/{song_id}")

        assert response.status_code == 200


def fakeuser():
    return {
        "account_id": 1,
        "username": "string",
        "first_name": "string",
        "last_name": "string",
        "profile_picture_url": "string",
        "banner_url": "string"
    }


class TestAccountUpdates:
    def update_account(self, account_id, account_data):
        result = {
                "account_id": 1,
                "username": "string",
                "first_name": "string",
                "last_name": "string",
                "profile_picture_url": "string",
                "banner_url": "string"
            }
        return result


def test_update_acc():
    app.dependency_overrides[AccountQueries] = TestAccountUpdates
    app.dependency_overrides[authenticator.get_current_account_data] = fakeuser

    edit = {
        "first_name": "string",
        "last_name": "string",
        "profile_picture_url": "string",
        "banner_url": "string",
        "signup_date": "2023-12-11T22:24:21.667Z"
    }

    response = client.put("/api/account/1", json=edit,
                          headers={"Authorization": "bearer fake"})

    expected = {
        "account_id": 1,
        "username": "string",
        "first_name": "string",
        "last_name": "string",
        "profile_picture_url": "string",
        "banner_url": "string"
    }

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected
