from main import app
from fastapi.testclient import TestClient
from queries.merch import MerchQueries

client = TestClient(app)


class TestMerchQueries:
    def get_all_merch(self):
        result = [
            {
                "item_id": 1,
                "name": "string",
                "image_url": "string",
                "price": 0,
                "size": "string",
                "description": "string",
                "quantity": 0
            },
        ]
        return result

    def get_one_merch(self, item_id):
        result = {
                "item_id": 4,
                "name": "string",
                "image_url": "string",
                "price": 0,
                "size": "string",
                "description": "string",
                "quantity": 0
        }
        return result


def test_merch_list():
    app.dependency_overrides[MerchQueries] = TestMerchQueries
    response = client.get("/api/merch")

    expected = [
        {
            "item_id": 1,
            "name": "string",
            "image_url": "string",
            "price": 0,
            "size": "string",
            "description": "string",
            "quantity": 0
        }
    ]

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected


def test_get_one_merch():
    app.dependency_overrides[MerchQueries] = TestMerchQueries
    response = client.get("/api/merch/4")

    expected = {
            "item_id": 4,
            "name": "string",
            "image_url": "string",
            "price": 0,
            "size": "string",
            "description": "string",
            "quantity": 0
        }

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == expected
