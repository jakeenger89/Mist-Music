from fastapi import (
    APIRouter,
    Depends,
    Response,
    HTTPException,
    status,
    Request,
)
from queries.accounts import (
    AccountQueries,
    AccountIn,
    AccountOut,
    Follow,
    DuplicateAccountError,
    AccountUpdateIn,
    AccountOutWithPassword,
    AccountUpdateOut
)
from jwtdown_fastapi.authentication import Token
from routers.authenticator import authenticator
from pydantic import BaseModel
from typing import List

router = APIRouter()


class AccountForm(BaseModel):
    username: str
    password: str


class AccountToken(Token):
    account: AccountOut


class HttpError(BaseModel):
    detail: str


class UpdateAccountForm(BaseModel):
    username: str
    email: str
    new_password: str = None
    first_name: str = None
    last_name: str = None
    profile_picture_url: str = None
    banner_url: str = None


@router.get("/api/protected", response_model=bool)
async def get_protected(
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    return True


@router.get("/token", response_model=AccountToken | None)
async def get_token(
    request: Request,
    account: AccountOut = Depends(authenticator.try_get_current_account_data),
) -> AccountToken | None:
    if account and authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": account,
        }


@router.post(
    "/api/create_account", response_model=AccountOutWithPassword | HttpError
)
async def create_account(
    info: AccountIn,
    request: Request,
    response: Response,
    accounts: AccountQueries = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = accounts.create(info, hashed_password)
        return account
    except DuplicateAccountError:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return HttpError(
            detail="Cannot create an account with those credentials"
        )


@router.put("/api/account/{account_id}", response_model=AccountUpdateOut)
def update_account(
    account_id: int,
    account_update: AccountUpdateIn,
    repo: AccountQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if account_data:
        updated_account = repo.update_account(account_id, account_update)
        return updated_account
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")


@router.delete("/api/account/{account_id}", response_model=dict)
def delete_account(
    account_id: int,
    repo: AccountQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if not account_data:
        raise HTTPException(status_code=401, detail="Not authenticated")

    success = repo.delete_account(account_id)
    if success:
        return {"message": "User deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/api/accounts", response_model=List[AccountOut])
def get_accounts(queries: AccountQueries = Depends()):
    return queries.get_accounts()


@router.get("/api/account/{account_id}", response_model=AccountOut)
async def get_account(
    account_id: int,
    response: Response,
    queries: AccountQueries = Depends(),
):
    record = queries.get_account(account_id)
    if record is None:
        response.status_code = 404
    return record


@router.get("/api/login/{email}", response_model=AccountOut)
async def login_account(
    email: str,
    response: Response,
    queries: AccountQueries = Depends(),
):
    record = queries.login_account(email)
    if record is None:
        response.status_code = 404
    return record


@router.get("/api/search_accounts", response_model=List[AccountOut])
async def search_accounts(
    search_term: str,
    response: Response,
    queries: AccountQueries = Depends(),
):
    record = queries.search_accounts(search_term)
    if len(record) == 0:
        response.status_code = 404
        return []
    return record


@router.get("/api/account", response_model=AccountOutWithPassword)
def get_account_by_username(
    username: str,
    queries: AccountQueries = Depends(),
):
    account = queries.get_account_by_username(username)
    if account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.post("/accounts/{account_id}/follow", response_model=bool)
def follow_account(
    account_id: int,
    follow: Follow,
    queries: AccountQueries = Depends(),
):
    print(f"Follower ID (from request): {follow.follower_id}")
    print(f"Following ID (from request): {follow.following_id}")

    return queries.follow_account(follow.follower_id, follow.following_id)


@router.delete("/accounts/{account_id}/unfollow", response_model=bool)
def unfollow_account(
    account_id: int,
    unfollow: Follow,
    queries: AccountQueries = Depends(),
):
    queries.unfollow_account(account_id, unfollow.following_id)
    return True


@router.get(
    "/followed-accounts/{account_id}", operation_id="get_followed_accounts"
)
def get_followed_accounts(
    account_id: int,
    queries: AccountQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if account_data:
        try:
            followed_accounts_response = queries.get_followed_accounts(
                account_id
            )
            return followed_accounts_response
        except HTTPException as e:
            # Handle specific exceptions if needed
            raise e
        except Exception as e:
            print(f"Error in get_followed_accounts_route: {e}")
            raise HTTPException(
                status_code=500, detail="Error retrieving followed accounts"
            )
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")


@router.get(
    "/following-status/{follower_id}/{following_id}", response_model=dict
)
def get_following_status(
    follower_id: int,
    following_id: int,
    queries: AccountQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if account_data:
        try:
            is_following = queries.is_account_following(
                follower_id, following_id
            )
            return {"is_following": is_following}
        except HTTPException as e:
            # Handle specific exceptions if needed
            raise e
        except Exception as e:
            print(f"Error in get_following_status: {e}")
            raise HTTPException(
                status_code=500, detail="Error retrieving following status"
            )
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")
