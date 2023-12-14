import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./allaccount.css";

const AllAccountSongs = () => {
  const [accountSongs, setAccountSongs] = useState([]);
  const { account_id } = useParams();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      if (!account_id) {
        console.error("Account ID is undefined");
        return;
      }

      const accountIdInt = parseInt(account_id, 10);

      if (isNaN(accountIdInt)) {
        console.error("Invalid account_id:", account_id);
        return;
      }

      const response = await fetch(`http://localhost:8000/user-songs/${accountIdInt}`);
      const data = await response.json();
      setAccountSongs(data.songs);
    } catch (error) {
      console.error("Error fetching user songs:", error);
    }
  }, [account_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = (songId) => {
    console.log("Updating song with ID:", songId);
    console.log("Navigating to update page with account ID:", account_id);
    navigate(`/update-song/${songId}`, { state: { account_id } });
  };

  const handleDelete = async (songId) => {
    try {
      const authToken = localStorage.getItem("yourAuthToken");
      console.log("Auth Token:", authToken);

      if (!authToken) {
        console.error("Authentication token not found");
        return;
      }

      // Ask for confirmation before deleting
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this song?"
      );

      if (!confirmDelete) {
        console.log("Deletion canceled by user");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/songs/${songId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        console.log("Song deleted successfully");
        // Optionally, update state or perform additional actions
        fetchData();
      } else {
        const data = await response.json();
        console.error("Failed to delete song", response.status, data);
      }
    } catch (error) {
      console.error("Error deleting song:", error);
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
    <div className="AllSongs-container">
      <h1 className="AllSongs-heading text-3xl font-bold mt-4">
        Uploaded Songs
      </h1>
      <table className="table">
        <thead>
          <tr>
            <th className="border-b">Song Name</th>
            <th className="border-b">Artist</th>
            <th className="border-b">Album</th>
            <th className="border-b">Genre</th>
            <th className="border-b">Release Date</th>
            <th className="border-b">BPM</th>
            <th className="border-b"></th>
            <th className="border-b"></th>
          </tr>
        </thead>
        <tbody>
          {accountSongs.map((song) => (
            <tr key={song.song_id}>
              <td className="border-b">
                {/* Make the song name clickable */}
                <Link to={`/songs/${song.song_id}`}>{song.name}</Link>
              </td>
              <td className="border-b">{song.artist}</td>
              <td className="border-b">{song.album}</td>
              <td className="border-b">{song.genre}</td>
              <td className="border-b">{song.release_date}</td>
              <td className="border-b">{song.bpm}</td>
              <td className="border-b">
                {/* Add buttons for update and delete */}
                <button
                  className="btn-update"
                  onClick={() => handleUpdate(song.song_id)}
                >
                  Update
                </button>
              </td>
              <td className="border-b">
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(song.song_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllAccountSongs;
