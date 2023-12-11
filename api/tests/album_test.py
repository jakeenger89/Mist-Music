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
        "username": "a",
        "email": "a",
        "password": "a",
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
        assert created_album["cover_image_url"] == album_data["cover_image_url"]
    else:
        assert False, "Authentication failed"
