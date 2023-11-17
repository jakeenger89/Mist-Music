from fastapi import APIRouter, Depends, HTTPException
from queries.users import UserIn, UserOut, UserRepository

router = APIRouter()


@router.post("/users", response_model=UserOut)
def create_user(
    users: UserIn,
    repo: UserRepository = Depends()
):
    return repo.create(users)


@router.delete("/users/{user_id}", response_model=dict)
def delete_user(
    user_id: int,
    repo: UserRepository = Depends()
):
    success = repo.delete_user(user_id)
    if success:
        return {"message": "User deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")
