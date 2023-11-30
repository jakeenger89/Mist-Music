import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSongForm = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [length, setLength] = useState('');
  const [bpm, setBpm] = useState('');
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const yourAuthToken = localStorage.getItem('yourAuthToken');

        if (!isAuthenticated || !yourAuthToken) {
          // Redirect to the login page
          navigate('/loginform');
          return;
        }

        const response = await fetch('http://localhost:8000/api/albums', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${yourAuthToken}`,
          },
        });

        if (response.ok) {
          const albumData = await response.json();
          setAlbums(albumData.albums);
        } else {
          console.error('Failed to fetch albums');
        }
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the user is authenticated
    if (!isAuthenticated) {
      // Redirect to the login page
      navigate('/loginform');
      return;
    }

    const data = {
      name,
      artist,
      album,
      genre,
      release_date: releaseDate,
      length,
      bpm,
    };

    try {
      const response = await fetch('http://localhost:8000/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Song created successfully');
      } else {
        console.error('Failed to create song');
      }
    } catch (error) {
      console.error('Error creating song:', error);
    }
  };

  return (
    <div className="row">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <h1>Create Song</h1>
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
              <select
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="form-select"
              >
                <option value="" disabled>
                  Select Album (Optional)
                </option>
                {albums.map((album) => (
                  <option key={album.album_id} value={album.name}>
                    {album.name}
                  </option>
                ))}
              </select>
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
              Create Song
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSongForm;