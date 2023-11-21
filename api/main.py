from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import songs, merch, accounts, router
from routers.authenticator import authenticator

app = FastAPI()
app.include_router(authenticator.router)
app.include_router(router.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ.get("CORS_HOST", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "module": 3,
            "week": 17,
            "day": 5,
            "hour": 19,
            "min": "00"
        }
    }



app.include_router(accounts.router, prefix="", tags=["accounts"])
app.include_router(songs.router, prefix="", tags=["songs"])
app.include_router(merch.router, tags=["merch"])
