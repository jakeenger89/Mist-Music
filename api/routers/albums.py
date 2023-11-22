from fastapi import APIRouter, Depends, Response, HTTPException
from queries.albums import AlbumQueries, AlbumIn, AlbumOut
from typing import List
router = APIRouter()


@router.get("/api/albums", response_model=List[AlbumOut])
def get_all_albums(queries: AlbumQueries = Depends()):
    return {
        "albums": queries.get_all_albums(),
    }


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
    queries: AlbumQueries = Depends(),
):
    album_out = queries.create_album(album_in)
    return album_out


@router.put("/api/albums/{album_id}", response_model=AlbumOut)
def update_album(
    album_id: int,
    album_in: AlbumIn,
    queries: AlbumQueries = Depends(),
):
    album_out = queries.update_album(album_id, album_in)
    return album_out


@router.delete("/api/albums/{album_id}", response_model=dict)
def delete_album(
    album_id: int,
    repo: AlbumQueries = Depends()
):
    success = repo.delete_album(album_id)
    if success:
        return {"message": "Album deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Album not found")


#@router.delete("/api/albums/{album_id}", response_model=DeleteResponse)
#def delete_album(
#    album_id: int,
#    response: Response,
#    queries: AlbumQueries = Depends(),
#):
#    album_deleted = queries.delete_album(album_id)
#    if album_deleted:
#        return AlbumDeleteResponse(message="Album deleted")
#    else:
#        response.status_code = 404
#        return AlbumDeleteResponse(message="Album not found")
