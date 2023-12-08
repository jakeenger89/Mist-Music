from fastapi import APIRouter, Depends, Response, HTTPException
from queries.customer import (
    CustomerOut,
    CustomerIn,
    CustomerQuery,
    OrderOut,
    OrderIn,
    Error,
    CurrencyChangeIn,
    CurrencyChangeOut
)
from typing import List, Optional, Union
from jwtdown_fastapi.authentication import Token
from routers.authenticator import authenticator

router = APIRouter()


@router.get("/api/customer", response_model=List[CustomerOut])
def order_list(q: CustomerQuery = Depends()) -> List[CustomerOut]:
    return q.get_all_orders()


@router.post("/api/customer", response_model=OrderOut)
def create_order(order: CustomerIn, q: CustomerQuery = Depends()):
    return q.create_order(order)


@router.get("/api/customer/{order_id}", response_model=Optional[CustomerOut])
def get_one_order(
    order_id: int,
    response: Response,
    q: CustomerQuery = Depends(),
) -> CustomerOut:
    order = q.get_one_order(order_id)
    if order is None:
        response.status_code = 404
    return order


@router.put(
    "/api/customer/{order_id}", response_model=Union[CustomerOut, Error]
)
def update_order(
    order_id: int, order: OrderIn, q: CustomerQuery = Depends()
) -> Union[CustomerOut, Error]:
    return q.update_order(order_id, order)


@router.delete("/api/customer/{order_id}", response_model=bool)
def delete_merch(
    order_id: int,
    q: CustomerQuery = Depends(),
) -> bool:
    return q.delete_order(order_id)


@router.put(
    "/api/currency/{account_id}",
    response_model=Union[CurrencyChangeOut, Error],
)
def update_currency(
    account_id: int,
    acc: CurrencyChangeIn,
    q: CustomerQuery = Depends(),
    token: Token = Depends(authenticator.get_current_account_data),
) -> Union[CurrencyChangeOut, Error]:
    if not token:
        raise HTTPException(status_code=401, detail="User not authenticated")
    return q.update_currency(account_id, acc)


@router.get(
    "/api/currency/{account_id}",
    response_model=Optional[CurrencyChangeOut],
)
def get_currency(
    account_id: int,
    response: Response,
    q: CustomerQuery = Depends(),
    token: Token = Depends(authenticator.get_current_account_data),
) -> CurrencyChangeOut:
    if not token:
        raise HTTPException(status_code=401, detail="User not authenticated")

    currency = q.get_currency(account_id)
    if currency is None:
        response.status_code = 404
    return currency
