from typing import Optional, Literal, List
from pydantic import BaseModel, constr
from queries.pool import pool
from fastapi import HTTPException
from fastapi.responses import JSONResponse


class SongIn(BaseModel):
    name: Optional[str]
    artist: Optional[str]
    album: Optional[str]
    genre: Literal[
        "Rock",
        "Pop",
        "Hip Hop",
        "Jazz",
        "Country",
        "Electronic",
        "Classical",
    ]
    release_date: Optional[str]
    length: Optional[int]
    rating: Optional[int]
    bpm: Optional[constr(max_length=4)]
    account_id: Optional[int]


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
    likes_count: Optional[int] = None


class SongWithStatsOut(SongOut):
    account_id: int
    play_count: Optional[int] = None
    download_count: Optional[int] = None
    length: Optional[int]
    likes_count: Optional[int]


class SongsOut(BaseModel):
    songs: List[SongWithStatsOut]


class Like(BaseModel):
    account_id: int
    song_id: int


class SongQueries:
    def get_song(self, song_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT song_id, name, artist, album, genre,
                    release_date, length, bpm, rating
                    FROM songs
                    WHERE song_id = %s
                    """,
                    [song_id],
                )
                row = cur.fetchone()
                if row:
                    # Check if 'length' is None and handle it appropriately
                    length = (
                        row[6] if row[6] is not None else 0
                    )  # You can choose a default value
                    return SongOut(
                        song_id=row[0],
                        name=row[1],
                        artist=row[2],
                        album=row[3],
                        genre=row[4],
                        release_date=row[5],
                        length=length,
                        bpm=row[7],
                        rating=row[8],
                    )
                else:
                    return None

    def get_songs(self):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT s.song_id,
                               s.name,
                               s.artist,
                               s.album,
                               s.genre,
                               s.release_date,
                               s.length,
                               s.bpm,
                               s.rating,
                               COUNT(l.account_id) AS likes_count,
                               s.account_id  -- Include account_id field
                        FROM songs s
                        LEFT JOIN liked_songs l ON s.song_id = l.song_id
                        GROUP BY s.song_id, s.name, s.artist, s.album, s.genre,
                                 s.release_date, s.length, s.bpm, s.rating,
                                 s.account_id
                        """
                    )
                    songs = []
                    rows = cur.fetchall()
                    for row in rows:
                        # ... Other fields
                        likes_count = row[9] if row[9] is not None else 0

                        song = {
                            "song_id": row[0],
                            "name": row[1],
                            "artist": row[2],
                            "album": row[3],
                            "genre": row[4],
                            "release_date": row[5],
                            "length": row[6],
                            "bpm": row[7],
                            "rating": row[8],
                            "account_id": row[10],  # Include account_id
                            "liked_by_user": None,
                            "likes_count": likes_count,
                        }
                        songs.append(song)

                    # Modify the return statement to match the SongsOut model
                    return SongsOut(songs=songs)
        except Exception as e:
            print(f"Error in get_songs: {e}")
            raise HTTPException(status_code=500, detail="Error")

    def create_song(self, song_data: SongIn, account_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    # Create a new object with modified values
                    modified_song_data = SongIn(
                        name=song_data.name,
                        artist=song_data.artist,
                        album=song_data.album,
                        genre=song_data.genre,
                        release_date=song_data.release_date,
                        length=int(song_data.length)
                        if song_data.length
                        else None,
                        bpm=str(song_data.bpm)[:4],
                        rating=song_data.rating,
                        account_id=account_id,
                    )

                    cur.execute(
                        """
                        INSERT INTO songs (
                            name,
                            artist,
                            album,
                            genre,
                            release_date,
                            length,
                            bpm,
                            rating,
                            account_id
                            )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING song_id
                        """,
                        (
                            modified_song_data.name,
                            modified_song_data.artist,
                            modified_song_data.album,
                            modified_song_data.genre,
                            modified_song_data.release_date,
                            modified_song_data.length,
                            modified_song_data.bpm,
                            modified_song_data.rating,
                            modified_song_data.account_id,
                        ),
                    )

                    # Fetch the inserted song_id
                    song_id = cur.fetchone()[0]

                    # Construct the response
                    response_data = {
                        "song_id": song_id,
                        "name": modified_song_data.name,
                        "artist": modified_song_data.artist,
                        "album": modified_song_data.album,
                        "genre": modified_song_data.genre,
                        "release_date": modified_song_data.release_date,
                        "length": modified_song_data.length,
                        "bpm": modified_song_data.bpm,
                        "rating": modified_song_data.rating,
                        "liked_by_user": False,
                        "account_id": modified_song_data.account_id,
                    }

                    return JSONResponse(content=response_data)
                except Exception as e:
                    print(f"Error in create_song: {e}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Could not add the song. Error: {e}",
                    )

    # all liked songs an account has LIKED
    def get_liked_songs_by_account(self, account_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        """
                        SELECT s.song_id, s.name, s.artist, s.album, s.genre,
                        s.release_date,
                        s.length, s.bpm, s.rating,
                        l.account_id AS liked_by_user
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
                            "song_id": row[0],
                            "name": row[1],
                            "artist": row[2],
                            "album": row[3],
                            "genre": row[4],
                            "release_date": row[5],
                            "length": row[6],
                            "bpm": row[7],
                            "rating": row[8],
                            "liked_by_user": True,
                            # Indicates that the user has liked this song
                        }
                        liked_songs.append(song)
                    return {"songs": liked_songs}
                except Exception as e:
                    print(f"Error in get_liked_songs_by_account: {e}")
                    raise HTTPException(
                        status_code=500, detail="Error retrieving liked songs"
                    )

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
        # Check if the user is the owner of the song
        if not self.is_song_owner(song_id, account_id):
            raise HTTPException(
                status_code=403, detail="Not authorized to like this song"
            )

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

    # update a song
    def update_song(self, song_id: int, update_data: SongIn, account_id: int):
        # Function below to check if song_id is tied to that account_id
        if not self.is_song_owner(song_id, account_id):
            raise HTTPException(
                status_code=403, detail="Not authorized to update this song"
            )

        with pool.connection() as conn:
            with conn.cursor() as cur:
                update_values_dict = {
                    key: value
                    for key, value in update_data.dict(
                        exclude_unset=True
                    ).items()
                    if value is not None
                }

                # Remove 'length' and 'rating' from the update data
                update_values_dict.pop("length", None)
                update_values_dict.pop("rating", None)

                # Adjust conversion if BPM is not supposed to be an integer
                update_values_dict["bpm"] = (
                    int(update_values_dict["bpm"])
                    if "bpm" in update_values_dict
                    else None
                )

                # Create the SET clause for the SQL query
                set_clause = ", ".join(
                    [f"{key} = %s" for key in update_values_dict]
                )

                # Create a list of values for the SQL query
                update_values = list(update_values_dict.values())
                update_values.append(song_id)  # Append song_id to the end

                # Update the song
                cur.execute(
                    f"""
                    UPDATE songs
                    SET {set_clause}
                    WHERE song_id = %s
                    RETURNING song_id, name, artist, album, genre,
                    release_date, length, bpm, rating
                    """,
                    update_values,
                )

                updated_song = cur.fetchone()

                if not updated_song:
                    raise HTTPException(
                        status_code=404, detail="Song not found"
                    )

                # Construct the response data
                response_data = {
                    "song_id": updated_song[0],
                    "name": updated_song[1],
                    "artist": updated_song[2],
                    "album": updated_song[3],
                    "genre": updated_song[4],
                    "release_date": updated_song[5],
                    "length": updated_song[6],
                    "bpm": updated_song[7],
                    "rating": updated_song[8],
                }

                return JSONResponse(content=response_data)

    # helper check for update song
    def is_song_owner(self, song_id, account_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT 1
                    FROM songs
                    WHERE song_id = %s AND account_id = %s
                    """,
                    [song_id, account_id],
                )
                return cur.fetchone() is not None

    def delete_song(self, song_id, account_id):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        DELETE FROM songs
                        WHERE song_id = %s
                        """,
                        [song_id],
                    )
                    return True
        except Exception as e:
            print(f"Error deleting song: {e}")
            return False

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
                result = cur.fetchone()
                if result:
                    song_owner_account_id = result[0]
                    return account_id == song_owner_account_id
            return False

    def get_user_songs(self, account_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        """
                        SELECT song_id, name, artist, album, genre,
                        release_date, length, bpm, rating
                        FROM songs
                        WHERE account_id = %s
                        """,
                        [account_id],
                    )
                    user_songs = []
                    rows = cur.fetchall()
                    for row in rows:
                        song = {
                            "song_id": row[0],
                            "name": row[1],
                            "artist": row[2],
                            "album": row[3],
                            "genre": row[4],
                            "release_date": row[5],
                            "length": row[6],
                            "bpm": row[7],
                            "rating": row[8],
                            "liked_by_user": self.is_song_liked_by_user(
                                row[0], account_id
                            ),
                            "account_id": account_id,
                        }
                        user_songs.append(song)

                    # Modify the return statement to match the SongsOut model
                    return SongsOut(songs=user_songs)
                except Exception as e:
                    print(f"Error in get_user_songs: {e}")
                    raise HTTPException(
                        status_code=500, detail="Error retrieving user's songs"
                    )
