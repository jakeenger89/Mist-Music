import os
from fastapi import Depends
from jwtdown_fastapi.authentication import Authenticator
from queries.accounts import AccountQueries, AccountOut, AccountOutWithPassword


class UserAuthenticator(Authenticator):
    async def get_account_data (
            self,
            username: str,
            accounts: AccountQueries,
    ):
        return accounts.get(username)

    def get_account_getter(
            self,
            accounts: AccountQueries = Depends(),
    ):
        return accounts

    def get_hashed_password(self, account: AccountOutWithPassword):
        return account.hashed_password

    def get_user_data_for_cookie(self, account: AccountOut):
        return account.username, AccountOut(**account.dict())

authenticator = UserAuthenticator(os.environ["SIGNIN_KEY"])
