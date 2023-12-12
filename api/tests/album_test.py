from main import app
from fastapi.testclient import TestClient
from queries.albums import AlbumQueries
from routers.authenticator import authenticator

client = TestClient(app)


def fake_user():
    return {"account_id": 1, "scope": "dummy_scope"}


class TestAlbumQueries:
    def create_album(self, info):
        return {
            "album_id": 1,
            "name": info.name,
            "artist": info.artist,
            "genre": info.genre,
            "release_date": info.release_date,
            "cover_image_url": info.cover_image_url,
        }

    def get_all_albums(self):
        return [
            {
                "album_id": 1,
                "name": "Test Album",
                "artist": "Test Artist",
                "genre": "Test Genre",
                "release_date": "2023-12-14",
                "cover_image_url": "https://example.com/test-cover.jpg",
            }
        ]

    def get_album(self, album_id):
        return {
            "album_id": album_id,
            "name": "Test Album",
            "artist": "Test Artist",
            "genre": "Test Genre",
            "release_date": "2023-12-14",
            "cover_image_url": "https://example.com/test-cover.jpg",
        }

    def delete_album(self, album_id):
        return True


def test_create_album_with_authentication():
    app.dependency_overrides[AlbumQueries] = TestAlbumQueries
    app.dependency_overrides[authenticator.get_current_account_data]\
        = fake_user

    headers = {"Authorization": "Bearer test_token"}
    album_data = {
        "name": "Test Album",
        "artist": "Test Artist",
        "genre": "Test Genre",
        "release_date": "2023-12-14",
        "cover_image_url": "https://example.com/test-cover.jpg",
    }

    response = client.post("/api/albums", json=album_data, headers=headers)

    expected = {
        "album_id": 1,
        "name": "Test Album",
        "artist": "Test Artist",
        "genre": "Test Genre",
        "release_date": "2023-12-14",
        "cover_image_url": "https://example.com/test-cover.jpg",
    }

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected


def test_get_all_albums_unprotected():
    app.dependency_overrides[AlbumQueries] = TestAlbumQueries
    response = client.get("/api/albums")

    expected = [
        {
            "album_id": 1,
            "name": "Test Album",
            "artist": "Test Artist",
            "genre": "Test Genre",
            "release_date": "2023-12-14",
            "cover_image_url": "https://example.com/test-cover.jpg",
        }
    ]

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected


def test_get_album_by_id_unprotected():
    app.dependency_overrides[AlbumQueries] = TestAlbumQueries
    response = client.get("/api/albums/1")

    expected = {
        "album_id": 1,
        "name": "Test Album",
        "artist": "Test Artist",
        "genre": "Test Genre",
        "release_date": "2023-12-14",
        "cover_image_url": "https://example.com/test-cover.jpg",
    }

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected


def test_delete_album_with_authentication():
    app.dependency_overrides[AlbumQueries] = TestAlbumQueries
    app.dependency_overrides[authenticator.get_current_account_data]\
        = fake_user

    headers = {"Authorization": "Bearer test_token"}

    response = client.delete("/api/albums/1", headers=headers)

    expected = {"message": "Album deleted successfully"}

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected
