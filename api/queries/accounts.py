from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from queries.pool import pool


class AccountIn(BaseModel):
    username: str
    email_address: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    banner_url: Optional[str] = None
    signup_date: Optional[datetime] = None


class AccountOut(AccountIn):
    account_id: int
    signup_date: datetime

class AccountOutWithPassword(AccountOut):
    hashed_password: str

class AccountQueries:
    def get_accounts(self):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    Select info here
                    """
                )
                accounts = []
                rows = cur.fetchall()
                for row in rows:
                    account = accounts.append(account)
                return accounts
    # def get_all_users(self):
class AccountQueries:
    def get_all_accounts(self) -> List[AccountOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT account_id,
                            , username
                            , email
                            , password
                            , profile_picture
                            , signup_date
                            , first_name
                            , last_name
                            , banner_url
                        FROM users
                        ORDER BY username
                        """
                    )
                    result = []
                    for record in db:
                        account_out = AccountOut(
                            account_id=record[0],
                            username=record[1],
                            email_address=record[2],
                            password=record[3],
                            profile_picture_url=record[4],
                            signup_date=record[5],
                            first_name=record[6],
                            last_name=record[7],
                            banner_url=record[8],
                        )
                        result.append(account_out)
                    return result
        except Exception:
            return {"message": "Could not get all users"}

    def create_account(self, account_in: AccountIn) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    INSERT INTO account
                        (
                            username,
                            email_address,
                            password,
                            profile_picture_url,
                            first_name,
                            last_name,
                            banner_url
                        )
                    VALUES
                        (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING account_id, username, email_address, password, profile_picture_url, signup_date, first_name, last_name, banner_url
                    """,
                    [
                        account_in.username,
                        account_in.email_address,
                        account_in.password,
                        account_in.profile_picture_url,
                        account_in.first_name,
                        account_in.last_name,
                        account_in.banner_url,
                    ],
                )
                record = db.fetchone()
                AccountOut = AccountOut(
                    account_id=record[0],
                    username=record[1],
                    email_address=record[2],
                    password=record[3],
                    profile_picture_url=record[4],
                    signup_date=record[5],
                    first_name=record[6],
                    last_name=record[7],
                    banner_url=record[8],
                )
                return AccountOut
