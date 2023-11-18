from pydantic import BaseModel
from .pool import pool
from typing import List


class MerchIn(BaseModel):
    name: str
    image_url: str
    price: int
    size: str
    description: str
    quantity: int


class MerchOut(BaseModel):
    item_id: int | str
    name: str
    image_url: str
    price: int
    size: str
    description: str
    quantity: int


class MerchQueries:
    def create_merch(self, merch: MerchIn) -> MerchOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    INSERT INTO merchandise(
                        name,
                        image_url,
                        price,
                        size,
                        description,
                        quantity
                    )
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    [
                        merch.name,
                        merch.image_url,
                        merch.price,
                        merch.size,
                        merch.description,
                        merch.quantity
                    ]
                )
                id = result.fetchone()[0]

    def get_all_merch(self) -> List[MerchOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM merchandise
                    """
                )

                merch_list = []
                for record in result:
                    merch = self.record_to_merch_out(record)
                    merch_list.append(merch)
                return merch_list

    def record_to_merch_out(self, record):
        return MerchOut(
            item_id=record[0],
            name=record[1],
            image_url=record[2],
            price=record[3],
            size=record[4],
            description=record[5],
            quantity=record[6]
        )
