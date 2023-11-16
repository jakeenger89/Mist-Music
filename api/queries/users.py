
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserIn(BaseModel):
    user_id: int
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
