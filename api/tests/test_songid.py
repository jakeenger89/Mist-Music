from fastapi.testclient import TestClient
from main import app
from queries.songs import SongQueries

client = TestClient(app)


class TestSongQueries:
    def test_get_song_by_id(self):

        song_id = 1

        response = client.get(f"/api/songs/{song_id}")

        assert response.status_code == 200
