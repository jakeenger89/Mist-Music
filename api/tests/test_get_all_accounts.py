# from fastapi.testclient import TestClient
# from main import app
# from queries.accounts import AccountQueries
# from routers.authenticator import authenticator

# client = TestClient(app)


# class TestGetAllAccounts:
#     def get_accounts(self):
#         result = {
#             "account_id": 1,
#             "email": "string",
#             "username": "string",
#             "first_name": "string",
#             "last_name": "string",
#             "profile_picture_url": "string",
#             "banner_url": "string",
#             "signup_date": "2023-12-11T23:18:55.039Z"
#             }
#         return result


# def test_get_all_accounts():
#     app.dependency_overrides[AccountQueries] = TestGetAllAccounts

#     response = client.get("/api/accounts/")

#     expected = {
#         "account_id": 1,
#         "email": "string",
#         "username": "string",
#         "first_name": "string",
#         "last_name": "string",
#         "profile_picture_url": "string",
#         "banner_url": "string",
#         "signup_date": "2023-12-11T23:18:55.039Z"
#         }


#     app.dependency_overrides = {}

#     assert response.status_code == 200
#     assert response.json() == expected
