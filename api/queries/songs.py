from typing import Optional, Literal, List
from pydantic import BaseModel
from queries.pool import pool
from fastapi import HTTPException


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


class SongOut(BaseModel):
    song_id: int
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
    liked_by_user: Optional[bool] = None  # Make it optional


class SongWithStatsOut(SongOut):
    play_count: Optional[int] = None
    download_count: Optional[int] = None


class SongsOut(BaseModel):
    songs: List[SongWithStatsOut]


class Like(BaseModel):
    account_id: int
    song_id: int


class SongQueries:
    def get_song(self, song_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT s.id AS song_id, s.name, s.artist,
                    s.album, s.genre, s.release_date, s.length,
                    s.bpm, s.rating, s.like_by_use
                    FROM songs s
                    INNER JOIN users u ON(s.id = u.id)
                    WHERE s.id = %s
                    """,
                    [song_id],
                )

    def get_songs(self):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT song_id, name, artist, album, genre, release_date, length, bpm, rating
                        FROM songs
                    """)
                    songs = []
                    rows = cur.fetchall()
                    for row in rows:
                        song = {
                            'song_id': row[0],
                            'name': row[1],
                            'artist': row[2],
                            'album': row[3],
                            'genre': row[4],
                            'release_date': row[5],
                            'length': row[6],
                            'bpm': row[7],
                            'rating': row[8],
                            'liked_by_user': False  # You might need to determine this based on user data
                        }
                        songs.append(song)
                    return {"songs": songs}
        except Exception as e:
            print(f"Error in get_songs: {e}")
            raise HTTPException(status_code=500, detail="Error")

    def like_song(self, song_id, account_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    #like a song
                    cur.execute(
                        """
                        INSERT INTO song_likes (account_id, song_id)
                        VALUES (%s, %s)
                        """,
                        [account_id, song_id],
                    )
                    return True
                except Exception as e:
                    # Handle errors (e.g., duplicate likes)
                    print(e)
                    return False

    def unlike_song(self, song_id, account_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    # Delete a liked song
                    cur.execute(
                        """
                        DELETE FROM song_likes
                        WHERE account_id = %s AND song_id = %s
                        """,
                        [account_id, song_id],
                    )
                    return True
                except Exception as e:
                    # Handle errors (e.g., if the like doesn't exist)
                    print(e)
                    return False

    def delete_song(self, song_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM songs
                    WHERE song_id = %s
                    """,
                    [song_id]
                )
