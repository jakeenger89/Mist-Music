from pydantic import BaseModel
from .pool import pool
from typing import List


class CustomerIn(BaseModel):
    first_name: str
    last_name: str
    address: str
    city: str
    zipcode: int
    state: str


class CustomerOut(BaseModel):
    order_id: int
    first_name: str
    last_name: str
    address: str
    city: str
    zipcode: int
    state: str
    fulfilled: bool


class OrderOut(BaseModel):
    order_id: int
    first_name: str
    last_name: str
    address: str
    city: str
    zipcode: int
    state: str


class CustomerQuery:
    def get_all_orders(self) -> List[CustomerOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM customer
                    """
                )
                customer_list = []
                for record in result:
                    customer = self.record_to_customer_out(record)
                    customer_list.append(customer)
                return customer_list

    def create_order(self, order: CustomerIn) -> OrderOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    INSERT INTO customer(
                        first_name,
                        last_name,
                        address,
                        city,
                        zipcode,
                        state
                    )
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING order_id;
                    """,
                    [
                        order.first_name,
                        order.last_name,
                        order.address,
                        order.city,
                        order.zipcode,
                        order.state
                    ]
                )
                id = result.fetchone()[0]
                old_data = order.dict()
                return OrderOut(order_id=id, **old_data)

    def record_to_customer_out(self, record):
        return CustomerOut(
            order_id=record[0],
            first_name=record[1],
            last_name=record[2],
            address=record[3],
            city=record[4],
            zipcode=record[5],
            state=record[6],
            fulfilled=record[7]
        )
