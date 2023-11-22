from fastapi import (
    Depends,
    HTTPException,
    status,
    Response,
    APIRouter,
    Request,
)
from jwtdown_fastapi.authentication import Token
from routers.authenticator import authenticator
from pydantic import BaseModel

from queries.accounts import (
    AccountIn,
    AccountOut,
    AccountQueries,
    DuplicateAccountError,
    AccountUpdateIn,
)


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


router = APIRouter()


@router.get("/api/protected", response_model=bool)
async def get_protected(
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    return True


@router.get("/token", response_model=AccountToken | None)
async def get_token(
    request: Request,
    account: AccountOut = Depends(authenticator.try_get_current_account_data)
) -> AccountToken | None:
    if account and authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": account,
        }


@router.post("/api/accounts", response_model=AccountToken | HttpError)
async def create_account(
    info: AccountIn,
    request: Request,
    response: Response,
    accounts: AccountQueries = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = accounts.create(info, hashed_password)
    except DuplicateAccountError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an account with those credentials",
        )
    form = AccountForm(username=info.email, password=info.password)
    token = await authenticator.login(response, request, form, accounts)
    return AccountToken(account=account, **token.dict())


#@router.put("/api/account/{account_id}", response_model=AccountOut)
#def update_account(
#    account_id: int,
#    account_update: AccountUpdateIn,
#    repo: AccountQueries = Depends()
#):
#    updated_account = repo.update_account(account_id, account_update)
#    return updated_account

@router.put("/api/account/{account_id}", response_model=AccountOut)
def update_account(
    account_id: int,
    account_update: AccountUpdateIn,
    repo: AccountQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
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
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    if not account_data:
        raise HTTPException(status_code=401, detail="Not authenticated")

    success = repo.delete_account(account_id)
    if success:
        return {"message": "User deleted successfully kek"}
    else:
        raise HTTPException(status_code=404, detail="User not found lol")
