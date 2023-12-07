from pydantic import BaseModel
from typing import Optional, List, Union
from datetime import datetime
from queries.pool import pool
from fastapi import HTTPException


class DuplicateAccountError(ValueError):
    pass


class AccountIn(BaseModel):
    username: str
    email: str
    password: str


class AccountOut(BaseModel):
    account_id: int
    email: str
    username: str
    currency: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    banner_url: Optional[str] = None
    signup_date: Optional[datetime] = None


class AccountOutWithPassword(AccountOut):
    hashed_password: str
    account_id: Optional[int]


class AccountUpdateIn(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    banner_url: Optional[str] = None
    signup_date: Optional[datetime] = None
    currency: Optional[int] = None


class CurrencyChangeIn(BaseModel):
    currency: int


class CurrencyChangeOut(BaseModel):
    account_id: int
    currency: int


class IDError(BaseModel):
    message: str


class AccountQueries:
    def update_currency(
        self, account_id: int, amount: int
    ) -> Union[CurrencyChangeOut, IDError]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE account
                        SET currency = currency - %s
                        WHERE account_id = %s
                        """,
                        [amount, account_id],
                    )
                    return CurrencyChangeOut(
                        account_id=account_id, currency=-amount
                    )
        except Exception as e:
            print(e)
            return {"message": "Could not update currency"}

    def login_account(self, email: str) -> AccountOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT account_id,
                            username,
                            email,
                            currency,
                            password
                        FROM account
                        WHERE email = %s
                        ORDER BY username
                        """,
                        [email],
                    )
                    record = db.fetchone()
                    if record:
                        account_out = AccountOutWithPassword(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            currency=record[3],
                            password=record[4],
                            hashed_password=record[4],
                        )
                        return account_out
                    else:
                        return AccountOutWithPassword(
                            account_id="",
                            username="",
                            email="",
                            currency="",
                            password="",
                            hashed_password="",
                        )
        except Exception as e:
            print(e)
            return AccountOutWithPassword(
                account_id="",
                username="",
                email="",
                currency="",
                password="",
                hashed_password="",
            )

    def get_account(self, account_id: int) -> AccountOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                            account_id,
                            username,
                            email,
                            currency,
                            password
                        FROM account
                        WHERE account_id = %s
                        ORDER BY username
                        """,
                        [account_id],
                    )
                    record = db.fetchone()
                    if record:
                        account_out = AccountOutWithPassword(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            currency=record[3],
                            password=record[4],
                            hashed_password=record[4],
                        )
                        return account_out
                    else:
                        return AccountOutWithPassword(
                            account_id="",
                            username="",
                            email="",
                            currency="",
                            password="",
                            hashed_password="",
                        )
        except Exception as e:
            print(e)
            return AccountOutWithPassword(
                account_id="",
                username="",
                email="",
                currency="",
                password="",
                hashed_password="",
            )

    def get_accounts(self) -> List[AccountOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    records = db.execute(
                        """
                        SELECT
                            account_id,
                            email,
                            username,
                            currency,
                            first_name,
                            last_name,
                            profile_picture_url,
                            banner_url,
                            signup_date
                        FROM account
                        ORDER BY username
                        """
                    )
                    result = []
                    for record in records:
                        print("this is the record", record)
                        account_out = AccountOut(
                            account_id=int(record[0]),
                            email=record[1],
                            username=record[2],
                            currency=record[3],
                            first_name=record[4],
                            last_name=record[5],
                            profile_picture_url=record[6],
                            banner_url=record[7],
                            signup_date=record[8],
                        )
                        result.append(account_out)
                    return result
        except Exception:
            return {"message": "Could not get all users"}

    def create(
        self, info: AccountIn, hashed_password: str
    ) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    INSERT INTO account
                        (
                            username,
                            email,
                            password
                        )
                    VALUES
                        (%s, %s, %s)
                    RETURNING account_id, username, email, password
                    """,
                    [
                        info.username,
                        info.email,
                        hashed_password,
                    ],
                )
                record = db.fetchone()
                accountOut = AccountOutWithPassword(
                    account_id=record[0],
                    username=record[1],
                    email=record[2],
                    password=record[3],
                    hashed_password=hashed_password,
                )
                return accountOut

    def update_account(
        self, account_id: int, info: AccountUpdateIn
    ) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    db.execute(
                        """
                        UPDATE account
                        SET first_name = %s, last_name = %s,
                            profile_picture_url = %s, banner_url = %s,
                            signup_date = %s, currency = %s
                        WHERE account_id = %s
                        RETURNING account_id, username, email, password,
                            first_name, last_name, profile_picture_url,
                            banner_url, signup_date, currency
                        """,
                        [
                            info.first_name,
                            info.last_name,
                            info.profile_picture_url,
                            info.banner_url,
                            info.signup_date,
                            info.currency,
                            account_id,
                        ],
                    )
                    record = db.fetchone()
                    if record:
                        updated_account = AccountOut(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            password=record[
                                3
                            ],  # You can exclude this if you don't
                            # want to return the password
                            first_name=record[4],
                            last_name=record[5],
                            profile_picture_url=record[6],
                            banner_url=record[7],
                            signup_date=record[8],
                            currency=record[9],
                        )
                        return updated_account
                    else:
                        raise HTTPException(
                            status_code=404, detail="Account not found"
                        )
                except Exception as e:
                    raise HTTPException(status_code=500, detail=str(e))

    def delete_account(self, account_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM account
                        WHERE account_id = %s
                        """,
                        [account_id],
                    )
                    return True
        except Exception as e:
            print(e)
            return False


    def search_accounts(self, search_term: str) -> List[AccountOutWithPassword]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT account_id,
                            username,
                            email,
                            password
                        FROM account
                        WHERE username LIKE %s
                        ORDER BY username
                        """,
                        [f"%{search_term}%"],
                    )
                    records = db.fetchall()
                    accounts = [
                        AccountOutWithPassword(
                            account_id=record[0],
                            username=record[1],
                            email=record[2],
                            password=record[3],
                            hashed_password=record[3],
                        )
                        for record in records
                    ]
                    return accounts
        except Exception as e:
            print(f"Error in search_accounts: {e}")
            return []
