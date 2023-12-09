import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AllAccountSongs = () => {
  const [accountSongs, setAccountSongs] = useState([]);
  const { account_id } = useParams();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      if (!account_id) {
        console.error('Account ID is undefined');
        return;
      }

      const accountIdInt = parseInt(account_id, 10);

      if (isNaN(accountIdInt)) {
        console.error('Invalid account_id:', account_id);
        return;
      }

      const response = await fetch(`http://localhost:8000/user-songs/${accountIdInt}`);
      const data = await response.json();
      setAccountSongs(data.songs);
    } catch (error) {
      console.error('Error fetching user songs:', error);
    }
  }, [account_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = (songId) => {
    console.log('Updating song with ID:', songId);
    console.log('Navigating to update page with account ID:', account_id);
    navigate(`/update-song/${songId}`, { state: { account_id } });
  };

const handleDelete = async (songId) => {
  try {
    const authToken = localStorage.getItem('yourAuthToken');
    console.log('Auth Token:', authToken);

    if (!authToken) {
      console.error('Authentication token not found');
      return;
    }

    // Ask for confirmation before deleting
    const confirmDelete = window.confirm('Are you sure you want to delete this song?');

    if (!confirmDelete) {
      console.log('Deletion canceled by user');
      return;
    }

    const response = await fetch(`http://localhost:8000/api/songs/${songId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      console.log('Song deleted successfully');
      // Optionally, update state or perform additional actions
      fetchData();
    } else {
      const data = await response.json();
      console.error('Failed to delete song', response.status, data);
    }
  } catch (error) {
    console.error('Error deleting song:', error);
  }
};

  return (
    <div>
      <h1>All Account Songs</h1>
      <table>
        <thead>
          <tr>
            <th>Song Name</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Genre</th>
            <th>Release Date</th>
            <th>Length</th>
            <th>BPM</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {accountSongs.map((song) => (
            <tr key={song.song_id}>
              <td>{song.name}</td>
              <td>{song.artist}</td>
              <td>{song.album}</td>
              <td>{song.genre}</td>
              <td>{song.release_date}</td>
              <td>{song.length}</td>
              <td>{song.bpm}</td>
              <td>{song.rating}</td>
              <td>
                {/* Add buttons for update and delete */}
                <button onClick={() => handleUpdate(song.song_id)}>Update</button>
                <button onClick={() => handleDelete(song.song_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllAccountSongs;