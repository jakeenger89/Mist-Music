# from fastapi import (
#     APIRouter,
#     Depends,
#     Response,
#     HTTPException,
#     status,
#     Request,
# )
# from queries.accounts import (
#     AccountQueries,
#     AccountIn,
#     AccountOut,
#     DuplicateAccountError,
#     AccountUpdateIn,
#     AccountOutWithPassword,
#     CurrencyChangeOut,
#     CurrencyChangeIn,
#     IDError,
# )
# from jwtdown_fastapi.authentication import Token
# from routers.authenticator import authenticator
# from pydantic import BaseModel
# from typing import List, Union

# router = APIRouter()


# @router.get("/api/search", response_model=List[AccountOut])
# async def search_accounts(
#     search_term: str,
#     response: Response,
#     queries: AccountQueries = Depends(),
# ):
#     record = queries.search_accounts(search_term)
#     if len(record) == 0:
#         response.status_code = 404
#         return []
#     return record
