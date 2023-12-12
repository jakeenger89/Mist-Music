from unittest.mock import patch, MagicMock
import unittest
from queries.songs import SongQueries


# simple test to check whether a song has been liked
class TestLikeSong(unittest.TestCase):
    @patch('queries.songs.pool')
    def test_like_song_already_liked(self, mock_pool):

        song_queries = SongQueries()
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connection.__enter__.return_value.__enter__.return_value = (
            mock_cursor)
        mock_pool.connection.return_value = mock_connection

        mock_cursor.execute.side_effect = Exception("Duplicate entry")

        # Act
        result = song_queries.like_song(song_id=10, account_id=1)

        print("Result:", result)

        assert result is False


if __name__ == '__main__':
    unittest.main()
