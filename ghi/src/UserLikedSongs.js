import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AllAccountSongs from './allAccountSongs';

const UserLikedSongs = ({ account_id }) => {
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('yourAuthToken');

        if (!authToken) {
          console.error('Authentication token not found');
          return;
        }

        const response = await fetch(`http://localhost:8000/liked-songs/${account_id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.status === 401) {
          console.error('Unauthorized: Please check your authentication token');
          return;
        }

        const data = await response.json();

        setLikedSongs(data.songs || []);  // Add a nullish coalescing operator to handle undefined or null
      } catch (error) {
        console.error('Error fetching liked songs:', error);
      }
    };

    fetchData();
  }, [account_id]);

  return (
    <div>
      <h2>Your Liked Songs</h2>
      <ul>
        {likedSongs.map((song) => (
          <li key={song.song_id}>{song.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserLikedSongs;