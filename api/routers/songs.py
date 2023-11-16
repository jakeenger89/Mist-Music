from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel
import uuid
from queries import SongQueries
from typing import Literal

router = APIRouter()


class SongIn(BaseModel):
    name: str
    artist: str
    album: str
    genre: Literal[
        "Rock",
        "Pop",
        "Hip Hop",
        "Jazz",
        "Country",
        "Electronic",
        "Classical",
    ]
    release_date: str
    length: str
    bpm: str
    rating: str


#we put id and liked by user in song out becaues it wont be initialized until the songs been made/searched for
class SongOut(BaseModel):
    id: int
    name: str
    artist: str
    album: str
    genre: Literal[
        "Rock",
        "Pop",
        "Hip Hop",
        "Jazz",
        "Country",
        "Electronic",
        "Classical",
    ]
    release_date: str
    length: str
    bpm: str
    rating: str
    liked_by_user: bool | None


#additional statistics for songs
class SongWithStatsOut(SongOut):
    play_count: int | None
    download_count: int | None


#this will include SongsWithStatsOut when looking for a song
class SongsOut(BaseModel):
    songs: list[SongWithStatsOut]


#this ties a unique user id to a unique song id
class Like(BaseModel):
    user_id: int
    song_id: int


#get a specific song
@router.get("/api/songs/{song_id}", response_model=SongOut)
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
@router.get("/api/songs", response_model=SongsOut)
def get_songs(queries: SongQueries = Depends()):
    return {"songs": queries.get_songs()}


#create a song
@router.post("/api/songs", response_model=SongOut)
def create_song(
    song: SongIn,
    queries: SongQueries = Depends(),
):
    return queries.create_song(song)


#delete a song
@router.get("/api/{songs_id}", response_model=bool)
def delete_song(song_id: int, queries: SongQueries = Depends()):
    queries.delete_song(song_id)
    return True


#like a song
@router.post("/api/songs/{song_id}/like", response_model=bool)
def like_song(song_id: int, like: Like, queries: SongQueries = Depends()):
    queries.like_song(song_id, like.user_id)
    return True


# Unlike a song
@router.delete("/api/songs/{song_id}/unlike", response_model=bool)
def unlike_song(song_id: int, like: Like, queries: SongQueries = Depends()):
    queries.unlike_song(song_id, like.user_id)
    return True
