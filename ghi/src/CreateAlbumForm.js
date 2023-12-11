import React, { useState } from "react";
import "./CreateAlbum.css";

const CreateAlbumForm = ({ isAuthenticated, onSubmit }) => {
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

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
      case "coverImageUrl":
        setCoverImageUrl(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      console.error("User is not authenticated");
      return;
    }

    const authToken = localStorage.getItem("yourAuthToken");

    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    const formattedReleaseDate = new Date(releaseDate)
      .toISOString()
      .split("T")[0];
    const data = {
      name,
      artist,
      genre,
      release_date: formattedReleaseDate,
      cover_image_url: coverImageUrl,
    };

    try {
      const response = await fetch("${process.env.REACT_APP_API_HOST}/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Album created successfully");
        setName("");
        setArtist("");
        setGenre("");
        setReleaseDate("");
        setCoverImageUrl("");
        onSubmit(data);
      } else {
        const errorDetails = await response.json();
        console.error(
          "Failed to create album",
          response.status,
          response.statusText,
          errorDetails
        );

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
    <div className="CreateAlbum-container">
      <div className="col-2" style={{ marginTop: "25px" }}>
        {/* You can add an image here if needed */}
      </div>
      <div className="col-10">
        <div className="shadow p-4 mt-4 mx-auto">
          <h1>Add New Album</h1>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-6">
                <div className="form-floating">
                  <input
                    value={name}
                    onChange={(e) => handleChange(e)}
                    placeholder="Album Name"
                    required
                    type="text"
                    name="name"
                    className="form-control"
                  />
                  <label htmlFor="name">Album Name</label>
                </div>
              </div>

              <div className="col-6">
                <div className="form-floating">
                  <input
                    value={artist}
                    onChange={(e) => handleChange(e)}
                    placeholder="Artist"
                    required
                    type="text"
                    name="artist"
                    className="form-control"
                  />
                  <label htmlFor="artist">Artist</label>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <div className="form-floating">
                  <input
                    value={genre}
                    onChange={(e) => handleChange(e)}
                    placeholder="Genre"
                    required
                    type="text"
                    name="genre"
                    className="form-control"
                  />
                  <label htmlFor="genre">Genre</label>
                </div>
              </div>

              <div className="col-6">
                <div className="form-floating">
                  <input
                    value={releaseDate}
                    onChange={(e) => handleChange(e)}
                    required
                    type="date"
                    name="releaseDate"
                    className="form-control"
                  />
                  <label htmlFor="releaseDate">Release Date</label>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <div className="form-floating">
                  <input
                    value={coverImageUrl}
                    onChange={(e) => handleChange(e)}
                    placeholder="Cover Image URL"
                    type="text"
                    name="coverImageUrl"
                    className="form-control"
                  />
                  <label htmlFor="coverImageUrl">Cover Image URL</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Create Album
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumForm;
