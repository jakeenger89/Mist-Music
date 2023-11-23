from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from queries.pool import pool
from fastapi import HTTPException

class DuplicateAccountError(ValueError):
    pass


class AccountIn(BaseModel):
    username: str
    email: str
    password: str


class AccountOut(BaseModel):
    account_id: int
    email: str
    username: str


class AccountOutWithPassword(AccountOut):
    hashed_password: str


class AccountUpdateIn(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    banner_url: Optional[str] = None
    signup_date: Optional[datetime] = None


class AccountQueries():
    def get_account(self, email: str) -> AccountOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT account_id,
                            username,
                            email,
                            password
                        FROM account
                        WHERE email = %s
                        ORDER BY username
                        """,
                        [email],
                    )
                    record = db.fetchone()
                    if record:
                        account_out = AccountOutWithPassword(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            password=record[3],
                            hashed_password=record[3],
                        )
                        return account_out
                    else:
                        return AccountOutWithPassword(
                            account_id="",
                            username="",
                            email="",
                            password="",
                            hashed_password=""
                        )
        except Exception as e:
            return AccountOutWithPassword(
                account_id="",
                username="",
                email="",
                password="",
                hashed_password="",
            )


    def get_accounts(self) -> List[AccountOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    records = db.execute(
                        """
                        SELECT
                            account_id,
                            email,
                            username,
                        FROM account
                        ORDER BY username
                        """
                    )
                    result = []
                    for record in records:
                        print("this is the record", record)
                        account_out = AccountOut(
                            account_id=int(record[0]),
                            email=record[1],
                            username=record[2],
                        )
                        result.append(account_out)
                    return result
        except Exception:
            return {"message": "Could not get all users"}

    # def get_accounts(self, account_id=None):
    #     try:
    #         with pool.connection() as conn:
    #             with conn.cursor() as cur:
    #                 cur.execute("""
    #                     SELECT song_id, name, artist, album, genre, release_date, length, bpm, rating
    #                     FROM songs
    #                 """)
    #                 songs = []
    #                 rows = cur.fetchall()
    #                 for row in rows:
    #                     # Handle the case where 'rating' is None
    #                     rating = row[8] if row[8] is not None else "N/A"

    #                     # Check if the song is liked by the user and include the 'liked_by_user' attribute
    #                     liked_by_user = self.is_song_liked_by_user(row[0], account_id) if account_id else False

    #                     song = {
    #                         'song_id': row[0],
    #                         'name': row[1],
    #                         'artist': row[2],
    #                         'album': row[3],
    #                         'genre': row[4],
    #                         'release_date': row[5],
    #                         'length': row[6],
    #                         'bpm': row[7],
    #                         'rating': rating,
    #                         'liked_by_user': liked_by_user
    #                     }
    #                     songs.append(song)

    #                 if account_id:
    #                     # If account_id is specified, filter out songs not liked by the account
    #                     songs = [song for song in songs if song['liked_by_user']]

    #                 return {"songs": songs}
    #     except Exception as e:
    #         print(f"Error in get_songs: {e}")
    #         raise HTTPException(status_code=500, detail="Error")



    def create(self, info: AccountIn, hashed_password: str) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    INSERT INTO account
                        (
                            username,
                            email,
                            password
                        )
                    VALUES
                        (%s, %s, %s)
                    RETURNING account_id, username, email, password
                    """,
                    [
                        info.username,
                        info.email,
                        hashed_password,
                    ],
                )
                record = db.fetchone()
                accountOut = AccountOutWithPassword(
                    account_id=record[0],
                    username=record[1],
                    email=record[2],
                    password=record[3],
                    hashed_password=hashed_password,
                )
                return accountOut


    def update_account(self, account_id: int, info: AccountUpdateIn) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    db.execute(
                        """
                        UPDATE account
                        SET first_name = %s, last_name = %s,
                            profile_picture_url = %s, banner_url = %s,
                            signup_date = %s
                        WHERE account_id = %s
                        RETURNING account_id, username, email, password,
                            first_name, last_name, profile_picture_url,
                            banner_url, signup_date
                        """,
                        [
                            info.first_name, info.last_name,
                            info.profile_picture_url, info.banner_url,
                            info.signup_date, account_id
                        ],
                    )
                    record = db.fetchone()
                    if record:
                        updated_account = AccountOut(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            password=record[3],  # You can exclude this if you don't want to return the password
                            first_name=record[4],
                            last_name=record[5],
                            profile_picture_url=record[6],
                            banner_url=record[7],
                            signup_date=record[8],
                        )
                        return updated_account
                    else:
                        raise HTTPException(status_code=404, detail="Account not found")
                except Exception as e:
                    raise HTTPException(status_code=500, detail=str(e))


    def delete_account(self, account_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM account
                        WHERE account_id = %s
                        """,
                        [account_id],
                    )
                    return True
        except Exception as e:
            print(e)
            return False
