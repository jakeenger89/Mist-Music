from queries.songs import SongIn, SongsOut, SongQueries, Like
from typing import Literal
from fastapi import APIRouter, Depends, Response, HTTPException
from .authenticator import authenticator
from queries.accounts import AccountQueries


router = APIRouter()
song_queries = SongQueries()


#get a specific song
@router.get("/songs/{song_id}", response_model=SongsOut)
def get_song(
    song_id: int,
    queries: SongQueries = Depends(),
):
    song = queries.get_song(song_id)
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


#all songs
@router.get("/songs", response_model=SongsOut)
def get_songs(queries: SongQueries = Depends()):
    return queries.get_songs()


#create a song
@router.post("/songs", response_model=SongsOut)
def create_song(
    song: SongIn,
    queries: SongQueries = Depends(),
):
    return queries.create_song(song)


#DELETE a song
@router.delete("/songs/{songs_id}", response_model=bool)
def delete_song(
    song_id: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: SongQueries = Depends(),
):
    email = account_data.get("email")
    accounts = AccountQueries
    account_id = authenticator.get_account_data(email, accounts)
    if not queries.is_user_allowed_to_delete_song(song_id, account_id):
        raise HTTPException(status_code=403, detail="You are not allowed to delete")
    queries.delete_song(song_id)
    return True


#get all liked songs from an account
@router.get("/liked-songs/{account_id}", response_model=SongsOut, operation_id="get_liked_songs_by_account")
def get_liked_songs_by_account(account_id: int, queries: SongQueries = Depends()):
    return queries.get_songs(account_id)


#like a song
@router.post("/songs/{song_id}/like", response_model=bool)
def like_song(song_id: int, like: Like, queries: SongQueries = Depends()):
    queries.like_song(song_id, like.account_id)
    return True


# Unlike a song
@router.delete("/songs/{song_id}/unlike", response_model=bool)
def unlike_song(song_id: int, like: Like, queries: SongQueries = Depends()):
    queries.unlike_song(song_id, like.account_id)
    return True
