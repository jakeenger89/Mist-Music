from fastapi import APIRouter, Depends, Response
from queries.merch import MerchIn, MerchOut, MerchQueries
from typing import List


router = APIRouter()


@router.get("/api/merch", response_model=List[MerchOut])
def merch_list(q: MerchQueries = Depends()) -> List[MerchOut]:
    return q.get_all_merch()
