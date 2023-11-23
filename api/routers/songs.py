from queries.songs import SongIn, SongsOut, SongQueries, Like
from typing import Literal
from fastapi import APIRouter, Depends, Response
from routers.authenticator import authenticator


router = APIRouter()
song_queries = SongQueries()

#get a specific song
@router.get("/songs/{song_id}", response_model=SongsOut)
def get_song(
    song_id: int,
    response: Response,
    queries: SongQueries = Depends(),
):
    record = queries.get_song(song_id)
    if record is None:
        response.status_code = 404
    else:
        return record


#all songs
@router.get("/songs", response_model=SongsOut)
def get_songs(queries: SongQueries = Depends()):
    return queries.get_songs()


#create a song
#authentication required
@router.post("/songs", response_model=SongsOut)
def create_song(
    song: SongIn,
    queries: SongQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    if account_data:
        return queries.create_song(song)
    else:
        raise HTTPExcepton(status_code=401, detail="Not authorized")


#delete a song
@router.delete("/songs/{songs_id}", response_model=bool)
def delete_song(song_id: int, queries: SongQueries = Depends()):
    queries.delete_song(song_id)
    return True

#get all liked songs from an account
#authentication required
@router.get("/liked-songs/{account_id}", response_model=SongsOut, operation_id="get_liked_songs_by_account")
def get_liked_songs_by_account(
    account_id: int,
    queries: SongQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    if account_data:
        return queries.get_songs(account_id)
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")

#update song account posted
@router.put("/songs/{song_id}", response_model=SongsOut)
def update_song(
    song_id: int,
    update_data: SongIn,
    queries: SongQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    if account_data:
        return queries.update_song(song_id, update_data, account_data['account_id'])
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")

#like a song
#authentication required
@router.post("/songs/{song_id}/like", response_model=bool)
def like_song(song_id: int, like: Like, queries: SongQueries = Depends(), account_data: dict = Depends(authenticator.get_current_account_data)):
    if account_data:
        queries.like_song(song_id, like.account_id)
        return True
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")

# unlike a song
#authentication required
@router.delete("/songs/{song_id}/unlike", response_model=bool)
def unlike_song(song_id: int, like: Like, queries: SongQueries = Depends(), account_data: dict = Depends(authenticator.get_current_account_data)):
    if account_data:
        queries.unlike_song(song_id, like.account_id)
        return True
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")