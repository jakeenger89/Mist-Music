import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AllAccountSongs = () => {
  const [accountSongs, setAccountSongs] = useState([]);
  const { account_id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, [account_id]);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllAccountSongs;