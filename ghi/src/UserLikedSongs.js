import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserLikedSongs = () => {
  const { account_id, username } = useParams();
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('yourAuthToken');

        if (!authToken) {
          console.error('Authentication token not found');
          return;
        }

        // Check if account_id is undefined
        if (!account_id) {
          console.error('Account ID is undefined');
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
        setLikedSongs(data.songs || []);
      } catch (error) {
        console.error('Error fetching liked songs:', error);
      }
    };

    fetchData();
  }, [account_id, username]);

  return (
    <div>
      <h2>Liked Songs</h2>
      <table>
        <thead>
          <tr>
            <th>Song Name</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Genre</th>
            <th>Release Date</th>
            <th>BPM</th>
            <th>Rating</th>
            <th>Player</th>
          </tr>
        </thead>
        <tbody>
          {likedSongs.map((song) => (
            <tr key={song.song_id}>
              <td>{song.name}</td>
              <td>{song.artist}</td>
              <td>{song.album}</td>
              <td>{song.genre}</td>
              <td>{song.release_date}</td>
              <td>{song.bpm}</td>
              <td>{song.rating}</td>
              <td>
                {/* Display audio player and download link */}
                  <figure>
                    <figcaption>Listen to the song:</figcaption>
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
};

export default UserLikedSongs;