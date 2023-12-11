import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./SongPage.css";

function SongPage() {
  const { song_id } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLyrics, setShowLyrics] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/songs/${song_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });


        if (response.ok) {
          const songData = await response.json();
          setSong(songData);
        } else {
          console.error('Failed to fetch song');
        }
      } catch (error) {
        console.error('Error fetching song:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [song_id]);

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!song) {
    return <div>Error fetching song data</div>;
  }

  return (
    <div className="SongPage-container">
      <h1 className="SongPage-name mt-4">{song.name}</h1>

      <div className="SongPage-info-container">
        <div className="SongPage-info-left">
          <p>Album: {song.album}</p>
          <p>Artist: {song.artist}</p>
          <p>Genre: {song.genre}</p>
          <p>Release Date: {song.release_date}</p>
          <p>BPM: {song.bpm}</p>
        </div>

        {/* Display the image if available */}
        {song.image_url && (
          <div className="SongPage-info-right">
            <img src={song.image_url} alt={song.name} style={{ maxWidth: '300px', maxHeight: '300px' }} />
          </div>
        )}
      </div>

      {/* Player */}
      <div className="SongPage-player-container">
        <audio controls>
          <source src={song.url} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
        <Link to={song.url} download className="visually-hidden">Download</Link>
      </div>

      {/* Display the lyrics if available */}
      <div className="SongPage-lyrics-container">
        <h3 onClick={toggleLyrics}>Lyrics</h3>
        {showLyrics && <p>{song.lyrics}</p>}
      </div>
    </div>
  );
}

export default SongPage;
