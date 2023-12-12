import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";

const AlbumEdit = () => {
  const [albumData, setAlbumData] = useState({
    name: "",
    artist: "",
    genre: "",
    release_date: "",
    cover_image_url: "",
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const authToken = localStorage.getItem("yourAuthToken");
  const decodedToken = authToken
    ? JSON.parse(atob(authToken.split(".")[1]))
    : null;

  const album_id =
    decodedToken && decodedToken.sub && decodedToken.sub.album_id;

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        if (!album_id) {
          throw new Error("Album ID not found in the token.");
        }

        const response = await fetch(
          `http://localhost:8000/api/albums/${album_id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch album details.");
        }

        const albumDetails = await response.json();
        setAlbumData(albumDetails);
      } catch (error) {
        console.error("Failed to fetch album details:", error);
      }
    };

    // Only fetch the album if the album_id exists and authToken is present
    if (album_id && authToken) {
      fetchAlbum();
    }
  }, [album_id, authToken]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAlbumData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!album_id) {
        throw new Error("Album ID not found in the token.");
      }

      const response = await fetch(
        `http://localhost:8000/api/albums/${album_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(albumData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update album.");
      }

      setUpdateSuccess(true);

      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error updating album:", error);
    }
  };

  return (
    <MDBContainer fluid className="h-100" style={{ height: "100vh" }}>
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol
          md="10"
          lg="6"
          className="d-flex flex-column align-items-center"
        >
          <p
            className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4"
            style={{ color: "white" }}
          >
            Edit Album
          </p>
          <div className="d-flex flex-row align-items-center mb-4">
            <MDBIcon fas icon="compact-disc me-3" size="lg" />
            <MDBInput
              type="text"
              value={albumData.name}
              onChange={handleChange}
              name="name"
              placeholder="Album Name"
            />
          </div>
          <div className="d-flex flex-row align-items-center mb-4">
            <MDBIcon fas icon="user me-3" size="lg" />
            <MDBInput
              type="text"
              value={albumData.artist}
              onChange={handleChange}
              name="artist"
              placeholder="Artist"
            />
          </div>
          <div className="d-flex flex-row align-items-center mb-4">
            <MDBIcon fas icon="music me-3" size="lg" />
            <MDBInput
              type="text"
              value={albumData.genre}
              onChange={handleChange}
              name="genre"
              placeholder="Genre"
            />
          </div>
          <div className="d-flex flex-row align-items-center mb-4">
            <MDBIcon fas icon="calendar me-3" size="lg" />
            <MDBInput
              type="date"
              value={albumData.release_date}
              onChange={handleChange}
              name="release_date"
            />
          </div>
          <div className="d-flex flex-row align-items-center mb-4">
            <MDBIcon fas icon="image me-3" size="lg" />
            <MDBInput
              type="text"
              value={albumData.cover_image_url}
              onChange={handleChange}
              name="cover_image_url"
              placeholder="Cover Image URL"
            />
          </div>
          <MDBBtn
            className="mb-4"
            size="lg"
            onClick={handleSubmit}
            style={{ backgroundColor: "aqua", color: "black" }}
          >
            Save
          </MDBBtn>
          {updateSuccess && (
            <div style={{ color: "green" }}>Update Successful!</div>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default AlbumEdit;
