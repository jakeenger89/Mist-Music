
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from queries.pool import pool


class UserIn(BaseModel):
    username: str
    email_address: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    banner_url: Optional[str] = None
    signup_date: Optional[datetime] = None


class UserOut(UserIn):
    user_id: int
    signup_date: datetime


class UserRepository:
    def get_all_users(self) -> List[UserOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT id,
                             , username
                             , email
                             , password
                             , profile_picture
                             , signup_date,
                             , first_name
                             , last_name
                             , banner_url
                        FROM users
                        ORDER BY username
                        """
                    )
                    result = []
                    for record in db:
                        user_out = UserOut(
                            user_id=record[0],
                            username=record[1],
                            email_address=record[2],
                            password=record[3],
                            profile_picture_url=record[4],
                            signup_date=record[5],
                            first_name=record[6],
                            last_name=record[7],
                            banner_url=record[8],
                        )
                        result.append(user_out)
                    return result
        except Exception:
            return {"message": "Could not get all users"}

    def create(self, user_in: UserIn) -> UserOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    INSERT INTO users
                        (
                            username,
                            email,
                            password,
                            profile_picture,
                            first_name,
                            last_name,
                            banner_url
                        )
                    VALUES
                        (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    [
                        user_in.username,
                        user_in.email_address,
                        user_in.password,
                        user_in.profile_picture_url,
                        user_in.first_name,
                        user_in.last_name,
                        user_in.banner_url,
                    ],
                )
                record = db.fetchone()
                user_out = UserOut(
                    user_id=record[0],
                    username=record[1],
                    email_address=record[2],
                    password=record[3],
                    profile_picture_url=record[4],
                    signup_date=record[5],
                    first_name=record[6],
                    last_name=record[7],
                    banner_url=record[8],
                )
                return user_out
