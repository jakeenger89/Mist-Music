from fastapi import APIRouter, Depends, Response, HTTPException
from queries.merch import MerchIn, MerchOut, MerchQueries, Error
from typing import List, Union, Optional
from jwtdown_fastapi.authentication import Token
from routers.authenticator import authenticator


router = APIRouter()


@router.get("/api/merch", response_model=List[MerchOut])
def merch_list(q: MerchQueries = Depends()) -> List[MerchOut]:
    return q.get_all_merch()


@router.post("/api/merch", response_model=MerchOut)
def create_merch(merch: MerchIn, q: MerchQueries = Depends()):
    return q.create_merch(merch)


@router.put("/api/merch/{item_id}", response_model=Union[MerchOut, Error])
def update_merch(
    item_id: int, merch: MerchIn, q: MerchQueries = Depends()
) -> Union[MerchOut, Error]:
    return q.update_merch(item_id, merch)


@router.delete("/api/merch/{item_id}", response_model=bool)
def delete_merch(
    item_id: int,
    q: MerchQueries = Depends(),
) -> bool:
    return q.delete_merch(item_id)


@router.get("/api/merch/{item_id}", response_model=Optional[MerchOut])
def get_one_merch(
    item_id: int,
    response: Response,
    q: MerchQueries = Depends(),
    token: Token = Depends(authenticator.get_current_account_data),
) -> MerchOut:
    if not token:
        raise HTTPException(status_code=401, detail="User Not Authenticated")

    merch = q.get_one_merch(item_id)
    if merch is None:
        response.status_code = 404
    return merch
