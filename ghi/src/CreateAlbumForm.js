import React, { useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";

const CreateAlbumForm = ({ isAuthenticated, onSubmit }) => {
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(""); // Changed from "imageUrl" to "coverImageUrl"

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "artist":
        setArtist(value);
        break;
      case "genre":
        setGenre(value);
        break;
      case "releaseDate":
        setReleaseDate(value);
        break;
      case "coverImageUrl": // Changed from "imageUrl" to "coverImageUrl"
        setCoverImageUrl(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the user is authenticated
    if (!isAuthenticated) {
      // Redirect to the login page or handle unauthenticated user appropriately
      console.error("User is not authenticated");
      return;
    }

    // Retrieve the auth token from localStorage
    const authToken = localStorage.getItem("yourAuthToken");

    // Check if authToken is missing
    if (!authToken) {
      console.error("Authorization token is missing");
      // Handle the missing token appropriately (redirect to login, etc.)
      return;
    }

    // Prepare the data to be sent in the request
    const formattedReleaseDate = new Date(releaseDate)
      .toISOString()
      .split("T")[0];
    const data = {
      name,
      artist,
      genre,
      release_date: formattedReleaseDate,
      cover_image_url: coverImageUrl, // Changed from "image_url" to "cover_image_url"
    };

    try {
      // Use authToken in the headers for authentication
      const response = await fetch("http://localhost:8000/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Album created successfully");
        // Reset form values after successful submission
        setName("");
        setArtist("");
        setGenre("");
        setReleaseDate("");
        setCoverImageUrl(""); // Changed from "imageUrl" to "coverImageUrl"
        // Call the provided onSubmit callback with the data
        onSubmit(data);
      } else {
        // Log the details of the error
        const errorDetails = await response.json();
        console.error(
          "Failed to create album",
          response.status,
          response.statusText,
          errorDetails
        );

        // Handle specific validation errors if needed
        if (errorDetails && errorDetails.detail) {
          errorDetails.detail.forEach((detail) => {
            console.error("Validation error:", detail);
          });
        }
      }
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };

  return (
    <MDBContainer fluid>
      <MDBCard className="text-black m-5" style={{ borderRadius: "25px" }}>
        <MDBCardBody>
          <MDBRow>
            <MDBCol md="12">
              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                Add New Album
              </p>
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <MDBCol md="6">
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="compact-disc me-3" size="lg" />
                <MDBInput
                  label="Album Name"
                  id="albumName"
                  type="text"
                  className="w-100"
                  value={name}
                  onChange={handleChange}
                  name="name"
                />
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="user me-3" size="lg" />
                <MDBInput
                  label="Artist"
                  id="artist"
                  type="text"
                  className="w-100"
                  value={artist}
                  onChange={handleChange}
                  name="artist"
                />
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="music me-3" size="lg" />
                <MDBInput
                  label="Genre"
                  id="genre"
                  type="text"
                  className="w-100"
                  value={genre}
                  onChange={handleChange}
                  name="genre"
                />
              </div>
            </MDBCol>

            <MDBCol md="6">
              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="calendar me-3" size="lg" />
                <MDBInput
                  label="Release Date"
                  id="releaseDate"
                  type="date"
                  className="w-100"
                  value={releaseDate}
                  onChange={handleChange}
                  name="releaseDate"
                />
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="image me-3" size="lg" />
                <MDBInput
                  label="Cover Image URL"
                  id="coverImageUrl" // Changed from "imageUrl" to "coverImageUrl"
                  type="text"
                  className="w-100"
                  value={coverImageUrl} // Changed from "imageUrl" to "coverImageUrl"
                  onChange={handleChange}
                  name="coverImageUrl" // Changed from "imageUrl" to "coverImageUrl"
                />
              </div>
            </MDBCol>
          </MDBRow>

          <MDBBtn className="mb-4" size="lg" onClick={handleSubmit}>
            Create Album
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default CreateAlbumForm;
