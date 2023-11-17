from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from queries import UserQueries

router = APIRouter()


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



@router.get("api/users", response_model = UserOut)
def get_all_users(queries: UserQueries = Depends()):
    return {
        "users": queries.get_all_users(),
    }

@router.get("api/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    response: Response,
    queries: UserQueries = Depends(),
):
    record = queries.get_user(user_id)
    if record is None:
        response.status_code = 404
    else:
        return record
