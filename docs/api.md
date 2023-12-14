# API

## Users

- Method: POST, GET, DELETE, PUT

User APIs are called through "/api/users" and "/api/users/{account_id}"

GET All:

Expected

```
[
    {
    "account_id": 0,
    "email": "string",
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "profile_picture_url": "string",
    "banner_url": "string",
    "signup_date": "2023-12-12T02:18:40.741Z"
    }
]
```

GET One:

Expected

```
{
  "account_id": 0,
  "email": "string",
  "username": "string",
  "first_name": "string",
  "last_name": "string",
  "profile_picture_url": "string",
  "banner_url": "string",
  "signup_date": "2023-12-12T02:19:28.586Z",
  "hashed_password": "string"
}
```

## Songs

-Method: GET, POST, DELETE, PUT

Song APIs are called through "/api/songs" and "/api/songs/{song_id}"

GET Expected Output

```
{
  "songs": [
    {
      "song_id": 0,
      "name": "string",
      "artist": "string",
      "album": "string",
      "genre": "Rock",
      "release_date": "string",
      "length": 0,
      "bpm": "string",
      "rating": "string",
      "liked_by_user": true,
      "likes_count": 0,
      "account_id": 0,
      "url": "string",
      "lyrics": "string",
      "image_url": "string",
      "play_count": 0,
      "download_count": 0
    }
  ]
}

```

## Albums

- Method: GET, POST, DELETE, PUT

GET ALL Expected Output:

```
[
  {
    "album_id": 0,
    "name": "string",
    "artist": "string",
    "genre": "string",
    "release_date": "2023-12-12",
    "cover_image_url": "string"
  }
]
```

## Merch

- Method: GET, POST, DELETE, PUT

Merch APIs are called through "/api/merch" and "/api/merch/{item_id}

GET ALL expected output:

```
[
  {
    "item_id": 0,
    "name": "string",
    "image_url": "string",
    "price": 0,
    "size": "string",
    "description": "string",
    "quantity": 0
  }
]
```

## Customers

- Method: GET, POST, DELETE, PUT

Customer APIs may be called through "/api/customer" and "/api/customer/{order_id}"

```
[
  {
    "order_id": 0,
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "address": "string",
    "city": "string",
    "zipcode": 0,
    "state": "string",
    "fulfilled": true,
    "item_id": 0
  }
]
```
