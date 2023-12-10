import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./searchsong.css";

function AllSongs() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [account_id, setAccountId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

const handleLike = async (songId) => {
  try {
    if (!account_id) {
      console.error('User not authenticated');
      return;
    }

    // Make a POST request to like the song
    const response = await fetch(`http://localhost:8000/songs/${songId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // Include credentials (cookies) in the request
      body: JSON.stringify({
        account_id: account_id,
        song_id: songId,
      }),
    });

    if (response.ok) {
      // Refresh the songs after liking
      fetchSongs();
    } else {
      console.error('Failed to like the song');
    }
  } catch (error) {
    console.error('Error liking the song:', error);
  }
};

  const handleUnlike = async (songId) => {
    try {
      // Make a DELETE request to unlike the song
      const response = await fetch(`http://localhost:8000/api/songs/${songId}/unlike`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: account_id,
          song_id: songId,
        }),
      });

      if (response.ok) {
        // Refresh the songs after unliking
        fetchSongs();
      } else {
        console.error('Failed to unlike the song');
      }
    } catch (error) {
      console.error('Error unliking the song:', error);
    }
  };

  const fetchSongs = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/songs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const songData = await response.json();
        setSongs(songData.songs);
        // Filter songs based on the search term
        filterSongs(songData.songs, searchTerm);
      } else {
        console.error('Failed to fetch songs');
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const filterSongs = (allSongs, term) => {
    const filtered = allSongs.filter(
      (song) =>
        song.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSongs(filtered);
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    // Filter songs based on the updated search term
    filterSongs(songs, term);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('yourAuthToken');
    if (storedToken) {
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      const { account: { account_id } } = decodedToken;
      setAccountId(account_id);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="AllSongs-container">
      <h1 className="AllSongs-heading text-3xl font-bold mt-4">All Songs</h1>
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by song name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="p-2 border border-gray-300 rounded mb-4"
      />
      <table className="table">
        <thead>
          <tr>
            <th className="border-b">Name</th>
            <th className="border-b">Artist</th>
            <th className="border-b">Album</th>
            <th className="border-b">Genre</th>
            <th className="border-b">Release Date</th>
            <th className="border-b">BPM</th>
            <th className="border-b">Likes</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredSongs.map((song) => (
            <tr key={song.song_id}>
              <td className="border-b">
                <Link
                  to={`/songs/${song.song_id}`}
                  className="text-blue-500 hover:underline"
                >
                  {song.name}
                </Link>
              </td>
              <td className="border-b">{song.artist}</td>
              <td className="border-b">{song.album}</td>
              <td className="border-b">{song.genre}</td>
              <td className="border-b">{song.release_date}</td>
              <td className="border-b">{song.bpm}</td>
              <td className="border-b">{song.likes_count}</td>
              <td className="border-b">
                {account_id && (
                  <>
                    {/* Display both buttons without checking user_has_liked */}
                    <button
                      className="btn-like"
                      onClick={() => handleLike(song.song_id)}
                    >
                      Like
                    </button>
                    <button
                      className="btn-unlike"
                      onClick={() => handleUnlike(song.song_id)}
                    >
                      Unlike
                    </button>
                  </>
                )}
              </td>
              <td className="border-b">
                {/* Display audio player */}
                <figure>
                  <audio className="audio-player" controls>
                    <source src={song.url} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                </figure>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllSongs;