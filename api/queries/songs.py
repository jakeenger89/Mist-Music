from typing import Literal
from pydantic import BaseModel

class SongIn(BaseModel):
    name: str
    artist: str
    album: str
    genre: Literal[
        "Rock",
        "Pop",
        "Hip Hop",
        "Jazz",
        "Country",
        "Electronic",
        "Classical",
    ]
    release_date: str
    length: str
    bpm: str
    rating: str


#we put id and liked by user in song out becaues it wont be initialized until the songs been made/searched for
class SongOut(BaseModel):
    id: int
    name: str
    artist: str
    album: str
    genre: Literal[
        "Rock",
        "Pop",
        "Hip Hop",
        "Jazz",
        "Country",
        "Electronic",
        "Classical",
    ]
    release_date: str
    length: str
    bpm: str
    rating: str
    liked_by_user: bool | None


#additional statistics for songs
class SongWithStatsOut(SongOut):
    play_count: int | None
    download_count: int | None


#this will include SongsWithStatsOut when looking for a song
class SongsOut(BaseModel):
    songs: list[SongWithStatsOut]


#this ties a unique user id to a unique song id
class Like(BaseModel):
    user_id: int
    song_id: int


class SongQueries:
    def get_songs(self):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT id, name, artist, album, genre, release_date, length, bpm, rating
                        FROM songs
                    """)
                    songs = []
                    rows = cur.fetchall()
                    for row in rows:
                        song = {
                            'id': row[0],
                            'name': row[1],
                            'artist': row[2],
                            'album': row[3],
                            'genre': row[4],
                            'release_date': row[5],
                            'length': row[6],
                            'bpm': row[7],
                            'rating': row[8],
                        }
                        songs.append(song)
                    return songs
        except Exception as e:
            print(f"Error in get_songs: {e}")
            raise



    def like_song(self, song_id, user_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    #like a song
                    cur.execute(
                        """
                        INSERT INTO song_likes (user_id, song_id)
                        VALUES (%s, %s)
                        """,
                        [user_id, song_id],
                    )
                    return True
                except Exception as e:
                    # Handle errors (e.g., duplicate likes)
                    print(e)
                    return False

    def unlike_song(self, song_id, user_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    # Delete a liked song
                    cur.execute(
                        """
                        DELETE FROM song_likes
                        WHERE user_id = %s AND song_id = %s
                        """,
                        [user_id, song_id],
                    )
                    return True
                except Exception as e:
                    # Handle errors (e.g., if the like doesn't exist)
                    print(e)
                    return False
