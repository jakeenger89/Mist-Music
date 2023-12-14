# Mist Music

- Matthew Lee
- Jake Enger
- Brandon Moghadam
- Noah Naigzy
- Marcus Ware

Mist Music, the music app that allows users to share their music with others around the world.

## Design

- [API design](docs/api.md)

## Intended Market

We're targeting established and aspiring musicians who want a new way to share their music with the world.

## Functionality

- All Users may search and listen to music without being logged in
- All users may view merchandise, but you must be logged in to purchase
- A registered User may:
  - Add and delete albums
  - Add and delete songs
  - "Like" and "Follow" other users
  - View their liked songs in a list
  - Purchase Merchandise

## Project Initialization

1. Clone this repository to your local machine
2. On your terminal, change directories to your project directory
3. Run docker volume create postgres-data
4. Run docker-compose build
5. Run docker-compose up
6. After your docker containers are fully running, you man now go to:
   - http://localhost:3000/ to access the frontend
   - http://localhost:8000/ to access the backend
