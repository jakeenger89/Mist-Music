import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./CreateSongForm.css";

const UpdateSongForm = () => {
  const { song_id } = useParams();
  const { state } = useLocation();
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [bpm, setBpm] = useState("");

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        const authToken = localStorage.getItem("yourAuthToken");

        if (!authToken) {
          console.error("UpdateSongForm - Authorization token is missing");
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/api/songs/${song_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.ok) {
          const songData = await response.json();
          setName(songData.name);
          setArtist(songData.artist);
          setAlbum(songData.album);
          setGenre(songData.genre);
          setReleaseDate(songData.release_date);
          setBpm(songData.bpm);
        } else {
          console.error(
            "UpdateSongForm - Failed to fetch song data for update"
          );
        }
      } catch (error) {
        console.error(
          "UpdateSongForm - Error fetching song data for update:",
          error
        );
      }
    };

    fetchSongData();
  }, [state, song_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const authToken = localStorage.getItem("yourAuthToken");

      if (!authToken) {
        console.error("UpdateSongForm - Authorization token is missing");
        return;
      }

      // Other code...
    } catch (error) {
      console.error("UpdateSongForm - Error updating song:", error);
    }
  };

  return (
    <div className="CreateSongForm-container">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <h1>Update Song</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Song Name"
                required
                type="text"
                name="name"
                className="form-control"
              />
              <label htmlFor="name">Song Name</label>
            </div>

            <div className="form-floating mb-3">
              <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist"
                required
                type="text"
                name="artist"
                className="form-control"
              />
              <label htmlFor="artist">Artist</label>
            </div>

            <div className="form-floating mb-3">
              <input
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="Album"
                type="text"
                name="album"
                className="form-control"
              />
              <label htmlFor="album">Album</label>
            </div>

            <div className="form-floating mb-3">
              <input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Genre"
                required
                type="text"
                name="genre"
                className="form-control"
              />
              <label htmlFor="genre">Genre</label>
            </div>

            <div className="form-floating mb-3">
              <input
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
                type="date"
                name="releaseDate"
                className="form-control"
              />
              <label htmlFor="releaseDate">Release Date</label>
            </div>

            <div className="form-floating mb-3">
              <input
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                required
                pattern="\d*"
                title="BPM must be a number"
                type="text"
                name="bpm"
                className="form-control"
              />
              <label htmlFor="bpm">BPM</label>
            </div>

            <button type="submit" className="btn btn-primary">
              Update Song
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSongForm;
