import React, { useEffect, useState } from "react";

function AllSongs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
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
            <th>Play Count</th>
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
              <td>{song.play_count !== undefined ? song.play_count : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllSongs;