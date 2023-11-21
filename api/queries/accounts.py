from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from queries.pool import pool


class DuplicateAccountError(ValueError):
    pass


class AccountIn(BaseModel):
    username: str
    email: str
    password: str


class AccountOut(BaseModel):
    account_id: str
    email: str
    username: str


class AccountOutWithPassword(AccountOut):
    hashed_password: str


class AccountQueries():
    def get(self, email: str) -> AccountOutWithPassword:
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
                            password=record[3],
                            hashed_password=record[3],
                        )
                        return account_out
                    else:
                        return AccountOutWithPassword(
                            account_id="",
                            username="",
                            email="",
                            password="",
                            hashed_password=""
                        )
        except Exception as e:
            return AccountOutWithPassword(
                account_id="",
                username="",
                email="",
                password="",
                hashed_password="",
            )

    def create(self, info: AccountIn, hashed_password: str) -> AccountOutWithPassword:
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
