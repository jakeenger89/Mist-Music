import React, { useEffect, useState } from "react";

function AllSongs() {
  const [songs, setSongs] = useState([]);
  const [account_id, setAccountId] = useState(null);

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
      const response = await fetch('http://localhost:8000/api/songs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const songData = await response.json();
        setSongs(songData.songs);
      } else {
        console.error('Failed to fetch songs');
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
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
  }, []);

  return (
    <div>
      <h1>All Songs</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Genre</th>
            <th>Release Date</th>
            <th>BPM</th>
            <th>Rating</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.song_id}>
              <td>{song.name}</td>
              <td>{song.artist}</td>
              <td>{song.album}</td>
              <td>{song.genre}</td>
              <td>{song.release_date}</td>
              <td>{song.bpm}</td>
              <td>{song.rating}</td>
              <td>{song.likes_count}</td>
              <td>
                {account_id && (
                  <>
                  {!song.isOwner}
                    <button onClick={() => handleLike(song.song_id)}>Like</button>
                    <button onClick={() => handleUnlike(song.song_id)}>Unlike</button>
                  </>
                )}
              </td>
                <td>
                {/* Display audio player and download link */}
                <figure>
                  <audio controls>
                    <source src={song.url} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                  <a href={song.url} download>
                  </a>
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
