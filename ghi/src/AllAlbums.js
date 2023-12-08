import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
} from "mdb-react-ui-kit";

// Function to fetch all albums from the server
const fetchAllAlbums = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/albums");
    if (response.ok) {
      const albums = await response.json();
      return albums;
    } else {
      console.error(
        "Failed to fetch albums:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching albums:", error);
    return [];
  }
};

const AllAlbums = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // Fetch all albums when the component mounts
    const fetchAlbums = async () => {
      const albumsData = await fetchAllAlbums();
      setAlbums(albumsData);
    };

    fetchAlbums();
  }, []);

  return (
    <MDBContainer fluid>
      <MDBCard className="text-black m-5" style={{ borderRadius: "25px" }}>
        <MDBCardBody>
          <MDBRow>
            <MDBCol md="12">
              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                All Albums
              </p>
            </MDBCol>
          </MDBRow>

          {albums.map((album) => (
            <MDBRow key={album.id} className="mb-4">
              <MDBCol md="6">
                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="compact-disc me-3" size="lg" />
                  <div className="d-flex flex-column">
                    <strong>Album Name:</strong> {album.name}
                    <strong>Artist:</strong> {album.artist}
                    <strong>Genre:</strong> {album.genre}
                    <strong>Release Date:</strong> {album.release_date}
                  </div>
                </div>
              </MDBCol>

              <MDBCol md="6">
                <div className="d-flex flex-row align-items-center mb-4">
                  <img
                    src={album.cover_image_url}
                    alt={`Album cover for ${album.name}`}
                    className="img-fluid rounded"
                  />
                </div>
              </MDBCol>
            </MDBRow>
          ))}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default AllAlbums;
