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
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    banner_url: Optional[str] = None
    signup_date: Optional[datetime] = None


class AccountOutWithPassword(AccountOut):
    hashed_password: str
    account_id: Optional[int]


class AccountUpdateIn(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    banner_url: Optional[str] = None
    signup_date: Optional[datetime] = None


class Follow(BaseModel):
    follower_id: int
    following_id: int


class AccountQueries:
    def login_account(self, email: str) -> AccountOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            account_id,
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
                            hashed_password="",
                        )
        except Exception as e:
            print(e)
            return AccountOutWithPassword(
                account_id="",
                username="",
                email="",
                password="",
                hashed_password="",
            )

    def get_account(self, account_id: int) -> AccountOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            account_id,
                            username,
                            email,
                            first_name,
                            last_name,
                            profile_picture_url,
                            banner_url,
                            password
                        FROM account
                        WHERE account_id = %s
                        ORDER BY username
                        """,
                        [account_id],
                    )
                    record = db.fetchone()
                    if record:
                        account_out = AccountOutWithPassword(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            first_name=record[3],
                            last_name=record[4],
                            profile_picture_url=record[5],
                            banner_url=record[6],
                            password=record[7],
                            hashed_password=record[7],
                        )
                        return account_out
                    else:
                        return AccountOutWithPassword(
                            account_id="",
                            username="",
                            email="",
                            first_name="",
                            last_name="",
                            profile_picture_url="",
                            banner_url="",
                            password="",
                            hashed_password="",
                        )
        except Exception as e:
            print(e)
            return AccountOutWithPassword(
                account_id="",
                username="",
                email="",
                first_name="",
                last_name="",
                profile_picture_url="",
                banner_url="",
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
                            first_name,
                            last_name,
                            profile_picture_url,
                            banner_url,
                            signup_date
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
                            first_name=record[3],
                            last_name=record[4],
                            profile_picture_url=record[5],
                            banner_url=record[6],
                            signup_date=record[7],
                        )
                        result.append(account_out)
                    return result
        except Exception:
            return {"message": "Could not get all users"}

    def create(
        self, info: AccountIn, hashed_password: str
    ) -> AccountOutWithPassword:
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

    def update_account(
        self, account_id: int, info: AccountUpdateIn
    ) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    db.execute(
                        """
                        UPDATE account
                        SET username = %s, first_name = %s, last_name = %s,
                            profile_picture_url = %s, banner_url = %s,
                            signup_date = %s
                        WHERE account_id = %s
                        RETURNING account_id, username, email, password,
                            first_name, last_name, profile_picture_url,
                            banner_url, signup_date
                        """,
                        [
                            info.username,
                            info.first_name,
                            info.last_name,
                            info.profile_picture_url,
                            info.banner_url,
                            info.signup_date,
                            account_id
                        ],
                    )
                    record = db.fetchone()
                    if record:
                        updated_account = AccountOut(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            password=record[
                                3
                            ],  # You can exclude this if you don't
                            # want to return the password
                            first_name=record[4],
                            last_name=record[5],
                            profile_picture_url=record[6],
                            banner_url=record[7],
                            signup_date=record[8]
                        )
                        return updated_account
                    else:
                        raise HTTPException(
                            status_code=404, detail="Account not found"
                        )
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

    def search_accounts(
        self, search_term: str
    ) -> List[AccountOutWithPassword]:
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
                        WHERE LOWER (username) LIKE LOWER (%s)
                        ORDER BY username
                        """,
                        [f"%{search_term}%"],
                    )
                    records = db.fetchall()
                    accounts = [
                        AccountOutWithPassword(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            password=record[3],
                            hashed_password=record[3],
                        )
                        for record in records
                    ]
                    return accounts
        except Exception as e:
            print(f"Error in search_accounts: {e}")
            return []

    def get_account_by_username(self, username: str) -> AccountOutWithPassword:
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
                        WHERE username = %s
                        ORDER BY username
                        """,
                        [username],
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
                            hashed_password="",
                        )
        except Exception as e:
            print(e)
            return AccountOutWithPassword(
                account_id="",
                username="",
                email="",
                password="",
                hashed_password="",
            )

    def follow_account(self, follower_id, following_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    # Check if the user is already following the account
                    if self.is_account_following(follower_id, following_id):
                        return False  # User is already following the account

                    # Follow the account
                    cur.execute(
                        """
                        INSERT INTO following (follower_id, following_id)
                        VALUES (%s, %s)
                        """,
                        [follower_id, following_id],
                    )
                    return True
                except Exception as e:
                    # Handle errors (e.g., duplicate follows)
                    print(e)
                    return False

    def is_account_following(self, follower_id, following_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT 1
                    FROM following
                    WHERE follower_id = %s AND following_id = %s
                    """,
                    [follower_id, following_id],
                )
                return cur.fetchone() is not None

    def unfollow_account(self, follower_id, following_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    # Unfollow the account
                    cur.execute(
                        """
                        DELETE FROM following
                        WHERE follower_id = %s AND following_id = %s
                        """,
                        [follower_id, following_id],
                    )
                    return True
                except Exception as e:
                    print(e)
                    return False

    def get_followed_accounts(self, account_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    cur.execute(
                        """
                        SELECT following_id
                        FROM following
                        WHERE follower_id = %s
                        """,
                        [account_id],
                    )
                    followed_accounts = [row[0] for row in cur.fetchall()]
                    return {"followed_accounts": followed_accounts}
                except Exception as e:
                    print(f"Error in get_followed_accounts: {e}")
                    raise HTTPException(
                        status_code=500, detail="Error retrieving followed acc"
                    )

    def save_follow_relationship(self, follower_id, following_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    # Check if the user is already following the account
                    if self.is_account_following(follower_id, following_id):
                        return False  # User is already following the account

                    # Follow the account
                    cur.execute(
                        """
                        INSERT INTO following (follower_id, following_id)
                        VALUES (%s, %s)
                        """,
                        [follower_id, following_id],
                    )
                    return True
                except Exception as e:
                    # Handle errors (e.g., duplicate follows)
                    print(e)
                    return False

    def get_recent_uploads_for_followed_acc(self, account_id):
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT s.song_id, s.name, s.artist, s.album, s.genre,
                            s.release_date, s.length, s.bpm, s.rating, s.url
                        FROM songs s
                        JOIN following f ON s.account_id = f.following_id
                        WHERE f.follower_id = %s
                        ORDER BY s.release_date DESC
                        LIMIT 5
                        """,
                        [account_id],
                    )
                    records = db.fetchall()

                    recent_uploads = [
                        {
                            "song_id": record[0],
                            "name": record[1],
                            "artist": record[2],
                            "album": record[3],
                            "genre": record[4],
                            "release_date": record[5],
                            "length": record[6],
                            "bpm": record[7],
                            "rating": record[8],
                            "url": record[9],
                            # Add other fields as needed
                        }
                        for record in records
                    ]
                    return recent_uploads
        except Exception as e:
            print(f"Error in get_recent_uploads_for_followed_accounts: {e}")
            return []
