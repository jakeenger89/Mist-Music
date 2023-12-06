from queries.songs import SongIn, SongsOut, SongQueries, Like, SongOut
from queries.accounts import (
    AccountQueries,
)
from fastapi import APIRouter, Depends, HTTPException
from routers.authenticator import authenticator


router = APIRouter()
song_queries = SongQueries()
account_querries = AccountQueries()


# get a specific song by song id [x]
@router.get("/api/songs/{song_id}", response_model=SongOut)
def get_song_id(
    song_id: int,
    queries: SongQueries = Depends(SongQueries),
):
    song = queries.get_song(song_id)
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


# all songs w
@router.get("/api/songs", response_model=SongsOut)
def get_songs(queries: SongQueries = Depends()):
    return queries.get_songs()


# create a song w
# authentication required
@router.post("/api/songs", response_model=SongsOut)
def create_song(
    song: SongIn,
    queries: SongQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    try:
        print("Endpoint reached. Received data:", song.dict())
        if account_data:
            return queries.create_song(song, account_data["account_id"])
        else:
            raise HTTPException(status_code=401, detail="Not authorized")
    except Exception as e:
        print(f"Error in create_song: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Could not add the song. Error: {e}",
        )

@router.delete("/api/songs/{song_id}", response_model=bool)
def delete_song(
    song_id: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: SongQueries = Depends(),
):
    # Extract account_id from account_data
    email = account_data.get("email")
    accounts = AccountQueries
    account_id = authenticator.get_account_data(email, accounts)

    # Allow deletion without permission check
    queries.delete_song(song_id, account_id)
    return True


# get all liked songs from an account
# authentication required
@router.get(
    "/liked-songs/{account_id}",
    response_model=SongsOut,
    operation_id="get_liked_songs_by_account",
)
def get_liked_songs_by_account(
    account_id: int,
    queries: SongQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if account_data:
        try:
            liked_songs_response = (
                queries.get_liked_songs_by_account(account_id)
                )

            # Update the response structure to include account_id for each song
            for song in liked_songs_response["songs"]:
                song["account_id"] = account_id

            return liked_songs_response
        except HTTPException as e:
            # Handle specific exceptions if needed
            raise e
        except Exception as e:
            print(f"Error in get_liked_songs_by_account: {e}")
            raise HTTPException(
                status_code=500, detail="Error retrieving liked songs"
            )
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")


# update song account posted
@router.put("/api/songs/{song_id}", response_model=SongsOut)
def update_song(
    song_id: int,
    update_data: SongIn,
    queries: SongQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if account_data:
        return queries.update_song(
            song_id, update_data, account_data["account_id"]
        )
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")


# like a song
# authentication required
@router.post("/songs/{song_id}/like", response_model=bool)
def like_song(
    song_id: int,
    like: Like,
    queries: SongQueries = Depends(),
):
    queries.like_song(song_id, like.account_id)
    return True


# Unlike a song (authentication not required)
@router.delete("/api/songs/{song_id}/unlike", response_model=bool)
def unlike_song(
    song_id: int,
    like: Like,
    queries: SongQueries = Depends(),
):
    queries.unlike_song(song_id, like.account_id)
    return True


@router.get("/user-songs/{account_id}", response_model=SongsOut)
def get_user_songs(
    account_id: int,
    queries: SongQueries = Depends(),
):
    return queries.get_user_songs(account_id)
