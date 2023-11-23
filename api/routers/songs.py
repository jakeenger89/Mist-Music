from queries.songs import SongIn, SongsOut, SongQueries, Like, SongOut
from queries.accounts import AccountIn, AccountOut, AccountQueries, AccountOutWithPassword
from fastapi import APIRouter, Depends, Response, HTTPException
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


#all songs w
@router.get("/api/songs", response_model=SongsOut)
def get_songs(queries: SongQueries = Depends()):
    return queries.get_songs()


#create a song w
#authentication required
@router.post("/api/songs", response_model=SongsOut)
def create_song(
    song: SongIn,
    queries: SongQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    if account_data:
        return queries.create_song(song)
    else:
        raise HTTPException(status_code=401, detail="Not authorized")


#DELETE a song
@router.delete("/api/songs/{songs_id}", response_model=bool)
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
#authentication required
@router.get("/api/liked-songs/{account_id}", response_model=SongsOut, operation_id="get_liked_songs_by_account")
def get_liked_songs_by_account(
    account_id: int,
    queries: SongQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    if account_data:
        return queries.get_songs(account_id)
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")


#like a song
#authentication required
@router.post("/api/songs/{song_id}/like", response_model=bool)
def like_song(song_id: int, like: Like, queries: SongQueries = Depends(), account_data: dict = Depends(authenticator.get_current_account_data)):
    if account_data:
        queries.like_song(song_id, like.account_id)
        return True
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")

# unlike a song
#authentication required
@router.delete("/api/songs/{song_id}/unlike", response_model=bool)
def unlike_song(song_id: int, like: Like, queries: SongQueries = Depends(), account_data: dict = Depends(authenticator.get_current_account_data)):
    if account_data:
        queries.unlike_song(song_id, like.account_id)
        return True
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")
