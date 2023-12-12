from main import app
from fastapi.testclient import TestClient
from queries.customer import CustomerQuery
from routers.authenticator import authenticator


client = TestClient(app)


def fake_user():
    return {
        "account_id": 1,
        "currency": 200
    }


class TestCurrencyDecrement:
    def update_currency(self, account_id, token):
        result = {
            "account_id": 1,
            "currency": 60
        }
        return result


class TestCustomerQuery:
    def get_all_orders(self):
        result = [
            {
                "order_id": 1,
                "email": "we@we.com",
                "first_name": "Austin",
                "last_name": "jkiposezrg",
                "address": "EWwef",
                "city": "rawe",
                "zipcode": 94806,
                "state": "AZ",
                "fulfilled": False,
                "item_id": 1
            },
        ]
        return result

    def create_order(self, token):
        result = {
            "order_id": 5,
            "email": "string",
            "first_name": "string",
            "last_name": "string",
            "address": "string",
            "city": "string",
            "zipcode": 0,
            "state": "string",
            "item_id": 2
            }
        return result


def test_get_all_orders():
    app.dependency_overrides[CustomerQuery] = TestCustomerQuery
    response = client.get("/api/customer")

    expected = [
            {
                "order_id": 1,
                "email": "we@we.com",
                "first_name": "Austin",
                "last_name": "jkiposezrg",
                "address": "EWwef",
                "city": "rawe",
                "zipcode": 94806,
                "state": "AZ",
                "fulfilled": False,
                "item_id": 1
            },
        ]

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected


def test_currency_decrement():
    app.dependency_overrides[CustomerQuery] = TestCurrencyDecrement
    app.dependency_overrides[authenticator.get_current_account_data] = fake_user

    purchase = {
        "currency": 60
    }

    response = client.put("/api/currency/1", json=purchase, headers={'Authorization': 'Bearer faketoken'})

    expected = {
        "account_id": 1,
        "currency": 60
    }

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected


def test_create_order():
    app.dependency_overrides[CustomerQuery] = TestCustomerQuery
    app.dependency_overrides[authenticator.get_current_account_data] = fake_user

    order = {
            "email": "string",
            "first_name": "string",
            "last_name": "string",
            "address": "string",
            "city": "string",
            "zipcode": 0,
            "state": "string",
            "item_id": 2
        }

    response = client.post("/api/customer", json=order, headers={'Authorization': 'Bearer faketoken'})

    expected = {
            "order_id": 5,
            "email": "string",
            "first_name": "string",
            "last_name": "string",
            "address": "string",
            "city": "string",
            "zipcode": 0,
            "state": "string",
            "item_id": 2
        }

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected
