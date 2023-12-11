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


def test_protected_endpoint():
    username = "a"
    password = "a"

    token = get_valid_token(username, password)

    if token:
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/api/protected", headers=headers)
        assert response.status_code == 200
    else:
        assert False, "Authentication failed"


def test_create_song_with_account_id():
    song_data = {
        "name": "Star mining",
        "artist": "jake",
        "album": "",
        "genre": "Rock",
        "release_date": "2023-12-14",
        "length": None,
        "bpm": "432",
        "rating": "0",
        "liked_by_user": None,
        "likes_count": 1,
        "account_id": 1,
        "url": ("https://firebasestorage.googleapis.com/"
                "v0/b/mist-music.appspot.com/o/"
                "test%20(1).mp3?alt=media&token=9e882a7"
                "a-4956-4263-bb66-d1650cb9401c"
                ),
        "lyrics": None,
        "image_url": None,
        "play_count": None,
        "download_count": None,
    }

    username = "a"
    password = "a"

    token = get_valid_token(username, password)

    if token:
        headers = {"Authorization": f"Bearer {token}"}
        # Send a request to create a song
        response = client.post("/api/songs", json=song_data, headers=headers)
        assert response.status_code == 200
        created_song = response.json()
        # Verify that the account_id in the created song matches the input
        assert created_song.get("account_id") == song_data["account_id"]
    else:
        assert False, "Authentication failed"
