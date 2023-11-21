from pydantic import BaseModel
from .pool import pool
from typing import List, Union


class Error(BaseModel):
    message: str


class MerchIn(BaseModel):
    name: str
    image_url: str
    price: int
    size: str
    description: str
    quantity: int


class MerchOut(BaseModel):
    item_id: int
    name: str
    image_url: str
    price: int
    size: str
    description: str
    quantity: int


class MerchQueries:
    def get_one_merch(self, merch_id: int) -> Optional[MerchOut]:
        pass

    def delete_merch(self, merch_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM merchandise
                        WHERE item_id = %s
                        """,
                        [merch_id]
                    )
                    return True
        except Exception as e:
            print(e)
            return False

    def update_merch(self, merch_id: int, merch: MerchIn) -> Union[MerchOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE merchandise
                        SET name = %s
                            , image_url = %s
                            , price = %s
                            , size = %s
                            , description = %s
                            , quantity = %s
                        WHERE item_id = %s
                        """,
                        [
                            merch.name,
                            merch.image_url,
                            merch.price,
                            merch.size,
                            merch.description,
                            merch.quantity,
                            merch_id
                        ]
                    )
                    old_data = merch.dict()
                    return MerchOut(item_id=merch_id, **old_data)
        except Exception as e:
            print(e)
            return {"message": "Could not update item"}

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
                    RETURNING item_id;
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
                old_data = merch.dict()
                return MerchOut(item_id=id, **old_data)

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
