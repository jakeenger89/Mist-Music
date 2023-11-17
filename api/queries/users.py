from pydantic import BaseModel
from typing import Optional
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



class UserQueries:
    def get_users(self):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    Select info here
                    """
                )
                users = []
                rows = cur.fetchall()
                for row in rows:
                    user = users.append(user)
                return users
