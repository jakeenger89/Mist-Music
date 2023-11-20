from fastapi import APIRouter, Depends, Response, HTTPException
from queries.users import UserQueries, UserIn, UserOut, UserRepository


router = APIRouter()


@router.get("/api/users", response_model = UserOut)
def get_all_users(queries: UserRepository = Depends()):
    return {
        "users": queries.get_all_users(),
    }


@router.get("/api/users/{user_id}", response_model=UserOut)
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


@router.post("/api/users", response_model=UserOut)
def create_user(
    users: UserIn,
    repo: UserRepository = Depends()
):
    return repo.create_user(users)


@router.delete("/api/users/{user_id}", response_model=dict)
def delete_user(
    user_id: int,
    repo: UserRepository = Depends()
):
    success = repo.delete_user(user_id)
    if success:
        return {"message": "User deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")
