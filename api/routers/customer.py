from fastapi import APIRouter, Depends, Response
from queries.customer import CustomerOut, CustomerIn, CustomerQuery, OrderOut
from typing import List
router = APIRouter()


@router.get("/api/customer", response_model=List[CustomerOut])
def order_list(q: CustomerQuery = Depends()) -> List[CustomerOut]:
    return q.get_all_orders()


@router.post("/api/customer", response_model=OrderOut)
def create_order(order: CustomerIn, q: CustomerQuery = Depends()):
    return q.create_order(order)
