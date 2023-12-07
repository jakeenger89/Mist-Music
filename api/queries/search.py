# from pydantic import BaseModel
# from typing import  List
# from queries.pool import pool
# from fastapi import HTTPException

# from queries.accounts import AccountQueries, AccountOutWithPassword


# def search_accounts(search_term: str, request=None) -> List[AccountOutWithPassword]:
#         try:
#             with pool.connection() as conn:
#                 with conn.cursor() as db:
#                     db.execute(
#                         """
#                         SELECT account_id,
#                             username,
#                             email,
#                             password
#                         FROM account
#                         WHERE username LIKE %s
#                         ORDER BY username
#                         """,
#                         [f"%{search_term}%"],
#                     )
#                     records = db.fetchall()
#                     accounts = [
#                         AccountOutWithPassword(
#                             account_id=record[0],
#                             username=record[1],
#                             email=record[2],
#                             password=record[3],
#                             hashed_password=record[3],
#                         )
#                         for record in records
#                     ]
#                     return accounts
#         except Exception as e:
#             print(f"Error in search_accounts: {e}")
#             return []
