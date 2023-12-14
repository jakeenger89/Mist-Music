import React, { useState, useEffect } from "react";
import "./CreateSongForm.css";

const CreateSongForm = ({ isAuthenticated, setAuthenticated }) => {
  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [bpm, setBpm] = useState("");
  const [url, setUrl] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [albums, setAlbums] = useState([]);
  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/albums`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const albumData = await response.json();
          setAlbums(albumData);
        } else {
          console.error("Failed to fetch albums");
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);
  useEffect(() => {
    // Choose a random image URL from the imported images
    const imageNames = [
      "girldancing",
      "girlmusicnote",
      "girlpiano",
      "girlsinging",
    ];
    const randomIndex = Math.floor(Math.random() * imageNames.length);
    const randomImageName = imageNames[randomIndex];

    // Dynamically import the image based on the selected name
    import(`./images/${randomImageName}.webp`)
      .then((image) => setRandomImage(image.default))
      .catch((error) => console.error("Error importing image:", error));
  }, []);

  const genreOptions = [
    "Rock",
    "Pop",
    "Hip Hop",
    "Jazz",
    "Country",
    "Electronic",
    "Classical",
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      console.error("User is not authenticated");
      return;
    }

    const authToken = localStorage.getItem("yourAuthToken");
    console.log("Auth Token:", authToken);

    if (!authToken) {
      console.error("Authorization token is missing");
      return;
    }

    const decodedToken = JSON.parse(atob(authToken.split(".")[1]));
    console.log("Decoded Token:", decodedToken);
    const account_id = decodedToken.account.account_id;
    console.log(account_id);

    const data = {
      name,
      artist,
      album,
      genre,
      release_date: releaseDate,
      bpm,
      account_id: decodedToken.account.account_id,
      url,
      lyrics,
      image_url: imageUrl,
    };
    console.log("Data to be sent:", data);

    if (!data.hasOwnProperty("length")) {
      data.length = 0;
    }

    if (!data.hasOwnProperty("rating")) {
      data.rating = 0;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Song created successfully");
        setName("");
        setArtist("");
        setAlbum("");
        setGenre("");
        setReleaseDate("");
        setBpm("");
        setUrl("");
        setLyrics("");
        setImageUrl("");
      } else {
        const errorDetails = await response.json();
        console.error(
          "Failed to create song",
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
      console.error("Error creating song:", error);
    }
  };

  return (
    <div className="CreateSongForm-container">
      <div className="col-2" style={{ marginTop: "25px" }}>
        {randomImage && (
          <img
            src={randomImage}
            className="img-fluid rounded-5"
            alt=""
            style={{ width: "100%", height: "100%", borderRadius: "12px" }}
          />
        )}
      </div>
      <div className="col-10">
        <div className="shadow p-4 mt-4 mx-auto">
          <h1>Upload Song</h1>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-6">
                <div className="form-floating">
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
              </div>

              <div className="col-6">
                <div className="form-floating">
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
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <div className="form-floating">
                  <select
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="form-select"
                  >
                    <option value="" disabled>
                      Select Album (Optional)
                    </option>
                    {albums &&
                      albums.map((album) => (
                        <option key={album.album_id} value={album.name}>
                          {album.name}
                        </option>
                      ))}
                  </select>
                  <label htmlFor="album">Album</label>
                </div>
              </div>

              <div className="col-6">
                <div className="form-floating">
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="form-select"
                  >
                    <option value="" disabled>
                      Select Genre
                    </option>
                    {genreOptions.map((genreOption) => (
                      <option key={genreOption} value={genreOption}>
                        {genreOption}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="genre">Genre</label>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <div className="form-floating">
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
              </div>

              <div className="col-6">
                <div className="form-floating">
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
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <div className="form-floating">
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="URL (Optional)"
                    type="text"
                    name="url"
                    className="form-control"
                  />
                  <label className="url">Song URL</label>
                </div>
              </div>

              <div className="col-6">
                <div className="form-floating">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL (Optional)"
                    type="text"
                    name="imageUrl"
                    className="form-control"
                  />
                  <label htmlFor="imageUrl">Image URL (Optional)</label>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12">
                <div className="form-floating">
                  <textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder="Lyrics (Optional)"
                    type="text"
                    name="lyrics"
                    className="form-control"
                    rows="5"
                  />
                  <label htmlFor="lyrics">Lyrics (Optional)</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Create Song
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSongForm;
