from fastapi import APIRouter, Depends
from queries.merch import MerchIn, MerchOut, MerchQueries, Error
from typing import List, Union


router = APIRouter()


@router.get("/api/merch", response_model=List[MerchOut])
def merch_list(q: MerchQueries = Depends()) -> List[MerchOut]:
    return q.get_all_merch()


@router.post("/api/merch", response_model=MerchOut)
def create_merch(merch: MerchIn, q: MerchQueries = Depends()):
    return q.create_merch(merch)


@router.put("/api/merch/{item_id}", response_model=Union[MerchOut, Error])
def update_merch(
    item_id: int,
    merch: MerchIn,
    q: MerchQueries = Depends()
) -> Union[MerchOut, Error]:
    return q.update_merch(item_id, merch)
