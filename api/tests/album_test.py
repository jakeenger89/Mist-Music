from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def get_valid_token(username, password):
    auth_endpoint = "/token"
    data = {
        "username": username,
        "password": password,
        "grant_type": "password",
    }

    response = client.post(auth_endpoint, data=data)

    if response.status_code == 200:
        token = response.json().get("access_token")
        return token
    else:
        print(f"Authentication failed: {response.status_code}")
        return None


def test_create_album_with_authentication():
    account_data = {
        "username": "24",
        "email": "24",
        "password": "24",
    }

    token = get_valid_token(account_data["username"], account_data["password"])

    if token:
        headers = {"Authorization": f"Bearer {token}"}

        album_data = {
            "name": "Test Album",
            "artist": "Test Artist",
            "genre": "Test Genre",
            "release_date": "2023-12-14",
            "cover_image_url": "https://example.com/test-cover.jpg",
        }

        response = client.post("/api/albums", json=album_data, headers=headers)

        assert response.status_code == 200

        created_album = response.json()

        assert created_album["name"] == album_data["name"]
        assert created_album["artist"] == album_data["artist"]
        assert created_album["genre"] == album_data["genre"]
        assert created_album["cover_image_url"] ==\
            album_data["cover_image_url"]
    else:
        assert False, "Authentication failed"


def test_get_all_albums_unprotected():
    response = client.get("/api/albums")

    assert response.status_code == 200

    all_albums = response.json()

    assert isinstance(all_albums, list)


def test_get_album_by_id_unprotected():
    response = client.get("/api/albums/2")

    assert response.status_code == 200

    album = response.json()

    assert isinstance(album, dict)


def test_delete_album_with_authentication():
    account_data = {
        "username": "24",
        "email": "24",
        "password": "24",
    }

    token = get_valid_token(account_data["username"], account_data["password"])

    if token:
        headers = {"Authorization": f"Bearer {token}"}

        response = client.delete("/api/albums/1", headers=headers)

        assert response.status_code == 200

        result = response.json()

        assert 'message' in result
        assert result['message'] == 'Album deleted successfully'
    else:
        assert False, "Authentication failed"