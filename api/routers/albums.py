from fastapi import APIRouter, Depends, Response, HTTPException
from queries.albums import AlbumQueries, AlbumIn, AlbumOut
from typing import List
from routers.authenticator import authenticator

router = APIRouter()


@router.get("/api/albums", response_model=List[AlbumOut])
def get_all_albums(response: Response, queries: AlbumQueries = Depends()):
    records = queries.get_all_albums()
    if records is None:
        response.status_code = 404
    else:
        return records


@router.get("/api/albums/{album_id}", response_model=AlbumOut)
def get_album(
    album_id: int,
    response: Response,
    queries: AlbumQueries = Depends(),
):
    record = queries.get_album(album_id)
    if record is None:
        response.status_code = 404
    else:
        return record


@router.post("/api/albums", response_model=AlbumOut)
def create_album(
    album_in: AlbumIn,
    response: Response,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: AlbumQueries = Depends(),
):
    if account_data:
        # Proceed with album creation logic after
        #  user authentication is confirmed
        album_out = queries.create_album(album_in)
        return album_out
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")


@router.put("/api/albums/{album_id}", response_model=AlbumOut)
def update_album(
    album_id: int,
    album_in: AlbumIn,
    response: Response,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: AlbumQueries = Depends(),
):
    if account_data:
        album_out = queries.update_album(album_id, album_in)
        return album_out
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")


@router.delete("/api/albums/{album_id}", response_model=dict)
def delete_album(
    album_id: int,
    response: Response,
    account_data: dict = Depends(authenticator.get_current_account_data),
    queries: AlbumQueries = Depends(),
):
    if account_data:
        success = queries.delete_album(album_id)
        if success:
            return {"message": "Album deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Album not found")
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")


@router.get("/api/search_albums", response_model=List[AlbumOut])
async def search_albums(
    search_term: str,
    response: Response,
    queries: AlbumQueries = Depends(),
):
    record = queries.search_albums(search_term)
    if len(record) == 0:
        response.status_code = 404
        return []
    return record
