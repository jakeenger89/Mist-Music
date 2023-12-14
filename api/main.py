from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import songs, merch, accounts, albums, customer, payment
from routers.authenticator import authenticator


app = FastAPI()
app.include_router(authenticator.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_HOST", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "You hit the root path!"}


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "module": 3,
            "week": 17,
            "day": 5,
            "hour": 19,
            "min": "00",
        }
    }


app.include_router(accounts.router, prefix="", tags=["accounts"])
app.include_router(songs.router, prefix="", tags=["songs"])
app.include_router(merch.router, tags=["merch"])
app.include_router(albums.router, tags=["albums"])
app.include_router(customer.router, tags=["customers"])
app.include_router(payment.router, tags=["payment"])
