from typing import Optional, Literal, List
from pydantic import BaseModel, constr
from queries.pool import pool
from fastapi import HTTPException
from fastapi.responses import JSONResponse


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
    length: int
    bpm: constr(max_length=4)
    rating: str
    account_id: int


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
    length: int
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
                    SELECT song.id AS song_id, s.name, s.artist,
                    s.album, s.genre, s.release_date, s.length,
                    s.bpm, s.rating, s.like_by_use
                    FROM songs
                    INNER JOIN users u ON(s.id = u.id)
                    WHERE s.id = %s
                    """,
                    [song_id],
                )

    def get_songs(self, account_id=None):
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
                        # Handle the case where 'rating' is None
                        rating = row[8] if row[8] is not None else "N/A"

                        # Check if the song is liked by the user and include the 'liked_by_user' attribute
                        liked_by_user = self.is_song_liked_by_user(row[0], account_id) if account_id else False

                        song = {
                            'song_id': row[0],
                            'name': row[1],
                            'artist': row[2],
                            'album': row[3],
                            'genre': row[4],
                            'release_date': row[5],
                            'length': row[6],
                            'bpm': row[7],
                            'rating': rating,
                            'liked_by_user': liked_by_user
                        }
                        songs.append(song)

                    if account_id:
                        # If account_id is specified, filter out songs not liked by the account
                        songs = [song for song in songs if song['liked_by_user']]

                    return {"songs": songs}
        except Exception as e:
            print(f"Error in get_songs: {e}")
            raise HTTPException(status_code=500, detail="Error")

    def create_song(self, song_data: SongIn):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    # Explicitly convert length to integer
                    song_data.length = int(song_data.length)
                    song_data.bpm = str(song_data.bpm)[:4]

                    cur.execute(
                        """
                        INSERT INTO songs (name, artist, album, genre, release_date, length, bpm, rating)
                        VALUES (%s, %s, %s, %s, %s, %s , %s, %s)
                        RETURNING song_id, name, artist, album, genre, release_date, length, bpm, rating
                        """,
                        (
                            song_data.name,
                            song_data.artist,
                            song_data.album,
                            song_data.genre,
                            song_data.release_date,
                            song_data.length,
                            song_data.bpm,
                            song_data.account_id
                        ),
                    )

                    # Fetch the inserted song_id
                    song_id = cur.fetchone()[0]

                    # Construct the response
                    response_data = {
                        "song_id": song_id,
                        "name": song_data.name,
                        "artist": song_data.artist,
                        "album": song_data.album,
                        "genre": song_data.genre,
                        "release_date": song_data.release_date,
                        "length": song_data.length,
                        "bpm": song_data.bpm,
                        "rating": song_data.rating,
                        "liked_by_user": False,
                    }

                    return JSONResponse(content=response_data)
                except Exception as e:
                    print(f"Error in create_song: {e}")
                    raise HTTPException(status_code=500, detail=f"Could not add the song. Error: {e}")

    #all liked songs an account has LIKED
    def get_liked_songs_by_account(self, account_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        """
                        SELECT s.song_id, s.name, s.artist, s.album, s.genre, s.release_date,
                        s.length, s.bpm, s.rating, l.account_id AS liked_by_user
                        FROM songs s
                        INNER JOIN liked_songs l ON s.song_id = l.song_id
                        WHERE l.account_id = %s
                        """,
                        [account_id],
                    )
                    liked_songs = []
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
                            'liked_by_user': True  # Indicates that the user has liked this song
                        }
                        liked_songs.append(song)
                    return {"songs": liked_songs}
                except Exception as e:
                    print(f"Error in get_liked_songs_by_account: {e}")
                    raise HTTPException(status_code=500, detail="Error retrieving liked songs")

    # Helper method to check if a song is liked by a user
    def is_song_liked_by_user(self, song_id, account_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT 1
                    FROM liked_songs
                    WHERE account_id = %s AND song_id = %s
                    """,
                    [account_id, song_id],
                )
                return cur.fetchone() is not None

    def like_song(self, song_id, account_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    # Like a song
                    cur.execute(
                        """
                        INSERT INTO liked_songs (account_id, song_id)
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
                    # Unlike a song
                    cur.execute(
                        """
                        DELETE FROM liked_songs
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

    def is_user_allowed_to_delete_song(self, song_id: int, account_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT account_id
                    FROM songs
                    WHERE song_id = %s
                    """,
                    [song_id],
                )
                song_owner_account = cur.fetchone()
                if song_owner_account:
                    song_owner_account_id = cur.fetchone()
                    return account_id == song_owner_account_id
                return False
