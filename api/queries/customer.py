from pydantic import BaseModel
from .pool import pool
from typing import List, Optional, Union


class Error(BaseModel):
    message: str


class CustomerIn(BaseModel):
    email: str
    first_name: str
    last_name: str
    address: str
    city: str
    zipcode: int
    state: str
    item_id: int


class CustomerOut(BaseModel):
    order_id: int
    email: str
    first_name: str
    last_name: str
    address: str
    city: str
    zipcode: int
    state: str
    fulfilled: bool
    item_id: int


class OrderIn(BaseModel):
    email: str
    first_name: str
    last_name: str
    address: str
    city: str
    zipcode: int
    state: str
    fulfilled: bool
    item_id: int


class OrderOut(BaseModel):
    order_id: int
    email: str
    first_name: str
    last_name: str
    address: str
    city: str
    zipcode: int
    state: str
    item_id: int


class CurrencyChangeIn(BaseModel):
    currency: int


class CurrencyChangeOut(BaseModel):
    account_id: int
    currency: int


class CustomerQuery:
    def get_currency(self, account_id: int) -> Optional[CurrencyChangeOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT account_id, currency
                        FROM account
                        WHERE account_id = %s
                        """,
                        [account_id],
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    curr = CurrencyChangeOut(
                        account_id=record[0],
                        currency=record[1],
                    )
                    return curr
        except Exception as e:
            print(e)
            return {"message": "Could not get currency"}

    def update_currency(
        self, account_id: int, acc: CurrencyChangeIn
    ) -> Union[CurrencyChangeOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE account
                        SET currency = currency - %s
                        WHERE account_id = %s
                        """,
                        [acc.currency, account_id],
                    )
                    old_data = acc.dict()
                    return CurrencyChangeOut(account_id=account_id, **old_data)
        except Exception as e:
            print(e)
            return {"message": "Could not update currency"}

    def update_order(
        self, cust_id: int, order: OrderIn
    ) -> Union[CustomerOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE customer
                        SET email = %s
                            , first_name = %s
                            , last_name = %s
                            , address = %s
                            , city = %s
                            , zipcode = %s
                            , state = %s
                            , item_id = %s
                            , fulfilled = %s
                        WHERE order_id = %s
                        """,
                        [
                            order.email,
                            order.first_name,
                            order.last_name,
                            order.address,
                            order.city,
                            order.zipcode,
                            order.state,
                            order.item_id,
                            order.fulfilled,
                            cust_id,
                        ],
                    )
                    old_data = order.dict()
                    return CustomerOut(order_id=cust_id, **old_data)
        except Exception as e:
            print(e)
            return {"message": "Could not update order"}

    def get_one_order(self, cust_id: int) -> Optional[CustomerOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT *
                        FROM customer
                        WHERE order_id = %s
                        """,
                        [cust_id],
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_customer_out(record)
        except Exception as e:
            print(e)
            return {
                "message": "Could not get the order.\
                    Maybe the order_id is invalid?"
            }

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
                        email,
                        first_name,
                        last_name,
                        address,
                        city,
                        zipcode,
                        state,
                        item_id
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING order_id;
                    """,
                    [
                        order.email,
                        order.first_name,
                        order.last_name,
                        order.address,
                        order.city,
                        order.zipcode,
                        order.state,
                        order.item_id
                    ],
                )
                id = result.fetchone()[0]
                old_data = order.dict()
                return OrderOut(order_id=id, **old_data)

    def delete_order(self, cust_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM customer
                        WHERE order_id = %s
                        """,
                        [cust_id],
                    )
                    return True
        except Exception as e:
            print(e)
            return False

    def record_to_customer_out(self, record):
        return CustomerOut(
            order_id=record[0],
            email=record[1],
            first_name=record[2],
            last_name=record[3],
            address=record[4],
            city=record[5],
            zipcode=record[6],
            state=record[7],
            item_id=record[8],
            fulfilled=record[9],
        )
