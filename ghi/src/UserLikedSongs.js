import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./searchsong.css";

const UserLikedSongs = () => {
  const { account_id, username } = useParams();
  const [likedSongs, setLikedSongs] = useState([]);

  const handleUnlike = async (songId) => {
    try {
      const authToken = localStorage.getItem("yourAuthToken");

      if (!authToken) {
        console.error("Authentication token not found");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/songs/${songId}/unlike`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ account_id: account_id, song_id: songId }), // Correctly include actual values
      });

      if (response.ok) {
        console.log("Successfully unliked the song:", songId);
        // Filter out the unliked song from the state
        setLikedSongs((prevLikedSongs) =>
          prevLikedSongs.filter((song) => song.song_id !== songId)
        );
      } else {
        const errorResponse = await response.json();
        console.error("Failed to unlike the song:", errorResponse);
      }
    } catch (error) {
      console.error("Error unliking the song:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("yourAuthToken");

        if (!authToken) {
          console.error("Authentication token not found");
          return;
        }

        // Check if account_id is undefined
        if (!account_id) {
          console.error("Account ID is undefined");
          return;
        }

        const response = await fetch(`http://localhost:8000/liked-songs/${account_id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.status === 401) {
          console.error("Unauthorized: Please check your authentication token");
          return;
        }

        const data = await response.json();
        console.log("Liked songs data:", data.songs);
        setLikedSongs(data.songs || []);
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      }
    };

    fetchData();
  }, [account_id, username]);

  return (
    <div className="AllSongs-container">
      <h3 className="AllSongs-header">Liked Songs</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Song Name</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Genre</th>
            <th>Release Date</th>
            <th>BPM</th>
            <th>Unlike</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {likedSongs.map((song) => (
            <tr key={song.song_id}>
              <td>
                <Link to={`/songs/${song.song_id}`}>{song.name}</Link>
              </td>
              <td>{song.artist}</td>
              <td>{song.album}</td>
              <td>{song.genre}</td>
              <td>{song.release_date}</td>
              <td>{song.bpm}</td>
              <td>
                <button
                  className="btn-unlike"
                  onClick={() => handleUnlike(song.song_id)}
                >
                  Unlike
                </button>
              </td>
              <td>
                <figure>
                  <audio controls>
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
};

export default UserLikedSongs;
