from fastapi import APIRouter, Depends, Response, HTTPException
from queries.accounts import AccountQueries, AccountIn, AccountOut, AccountQueries


router = APIRouter()


@router.get("/api/account", response_model=AccountOut)
def get_all_accounts(queries: AccountQueries = Depends()):
    return queries.get()



@router.get("/api/account/{account_id}", response_model=AccountOut)
def get_account(
    account_id: int,
    response: Response,
    queries: AccountQueries = Depends(),
):
    record = queries.get(account_id)
    if record is None:
        response.status_code = 404
    else:
        return record


# @router.post("/api/account", response_model=AccountOut)
# def create_account(
#     accounts: AccountIn,
#     repo: AccountQueries = Depends()
# ):
#     # print('account data', accounts)
#     return repo.create_account(accounts)


@router.delete("/api/account/{account_id}", response_model=dict)
def delete_account(
    account_id: int,
    repo: AccountQueries = Depends()
):
    success = repo.delete_account(account_id)
    if success:
        return {"message": "User deleted successfully kek"}
    else:
        raise HTTPException(status_code=404, detail="User not found lol")
