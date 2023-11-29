from pydantic import BaseModel
from queries.pool import pool
from datetime import date
from typing import List


class AlbumIn(BaseModel):
    name: str
    artist: str
    genre: str
    release_date: date
    cover_image_url: str


class AlbumOut(BaseModel):
    album_id: int
    name: str
    artist: str
    genre: str
    release_date: date
    cover_image_url: str


class AlbumQueries:
    def create_album(self, info: AlbumIn) -> AlbumOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        INSERT INTO albums (
                            name,
                            artist,
                            genre,
                            release_date,
                            cover_image_url
                        )
                        VALUES (
                            %s,
                            %s,
                            %s,
                            %s,
                            %s
                        )
                        RETURNING album_id, name, artist, genre, release_date, cover_image_url
                        """,
                        [
                            info.name,
                            info.artist,
                            info.genre,
                            info.release_date,
                            info.cover_image_url,
                        ],
                    )

                    record = db.fetchone()

                    if record:
                        album_out = AlbumOut(
                            album_id=record[0],
                            name=record[1],
                            artist=record[2],
                            genre=record[3],
                            release_date=record[4],
                            cover_image_url=record[5],
                        )

                        return album_out
                    else:
                        raise Exception("Failed to create album")

        except Exception as e:
            raise Exception(str(e))

    def update_album(self, album_id: int, info: AlbumIn) -> AlbumOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE albums
                        SET name = %s,
                            artist = %s,
                            genre = %s,
                            release_date = %s,
                            cover_image_url = %s
                        WHERE album_id = %s
                        RETURNING album_id, name, artist, genre, release_date, cover_image_url
                        """,
                        [
                            info.name,
                            info.artist,
                            info.genre,
                            info.release_date,
                            info.cover_image_url,
                            album_id,
                        ],
                    )

                    record = db.fetchone()

                    if record:
                        updated_album = AlbumOut(
                            album_id=record[0],
                            name=record[1],
                            artist=record[2],
                            genre=record[3],
                            release_date=record[4],
                            cover_image_url=record[5],
                        )

                        return updated_album
                    else:
                        raise Exception("Album not found")

        except Exception as e:
            raise Exception(str(e))

    def get_album(self, album_id: int) -> AlbumOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT album_id, name, artist, genre, release_date, cover_image_url
                        FROM albums
                        WHERE album_id = %s
                        """,
                        [album_id],
                    )

                    record = db.fetchone()

                    if record:
                        album_out = AlbumOut(
                            album_id=record[0],
                            name=record[1],
                            artist=record[2],
                            genre=record[3],
                            release_date=record[4],
                            cover_image_url=record[5],
                        )

                        return album_out
                    else:
                        return AlbumOut()

        except Exception as e:
            raise Exception(str(e))

    def delete_album(self, album_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM albums
                        WHERE album_id = %s
                        """,
                        [album_id],
                    )

                    return True

        except Exception as e:
            raise Exception(str(e))

            return False

    def get_all_albums(self) -> List[AlbumOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT album_id, name, artist, genre, release_date, cover_image_url
                        FROM albums
                        """
                    )

                    records = db.fetchall()

                    if records:
                        albums_out = []
                        for record in records:
                            album_out = AlbumOut(
                                album_id=record[0],
                                name=record[1],
                                artist=record[2],
                                genre=record[3],
                                release_date=record[4],
                                cover_image_url=record[5],
                            )

                            albums_out.append(album_out)

                        return albums_out
                    else:
                        return None

        except Exception as e:
            raise Exception(str(e))
