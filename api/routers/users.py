from fastapi import APIRouter, Depends, Response
from queries.users import UserQueries, UserIn, UserOut


router = APIRouter()


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
