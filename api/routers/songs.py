from queries.songs import SongIn, SongsOut, SongQueries, Like
from typing import Literal
from fastapi import APIRouter, Depends, Response


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
@router.post("/songs", response_model=SongsOut)
def create_song(
    song: SongIn,
    queries: SongQueries = Depends(),
):
    return queries.create_song(song)


#delete a song
@router.delete("/songs/{songs_id}", response_model=bool)
def delete_song(song_id: int, queries: SongQueries = Depends()):
    queries.delete_song(song_id)
    return True


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

@router.post("/songs", response_model=SongsOut, operation_id="create_song")
def create_song(
    song: SongIn,
    queries: SongQueries = Depends(),
):
    try:
        song_id = queries.create_song(song)
        return {"song_id": song_id, **song.dict(), "liked_by_user": None}
    except HTTPException as e:
        return e