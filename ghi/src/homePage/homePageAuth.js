import React, { useEffect, useState } from 'react';

const HomePageAuth = () => {
    const [randomMerch, setRandomMerch] = useState(null);
    const [recentUploads, setRecentUploads] = useState([]);

    const fetchRandomMerch = async () => {
        const url = "http://localhost:8000/api/merch/random";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            setRandomMerch(data);
        } else {
            console.error('Could not get merch');
        }
    };

    const fetchTopRecentUploads = async () => {
        try {
            const authToken = localStorage.getItem('yourAuthToken');

            const response = await fetch('http://localhost:8000/api/random-recent-uploads', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Shuffle the array and take the first 3 elements
                const shuffledSongs = data.sort(() => Math.random() - 0.5).slice(0, 3);
                setRecentUploads(shuffledSongs);
            } else {
                console.error('Failed to fetch random recent uploads');
            }
        } catch (error) {
            console.error('Error fetching random recent uploads:', error);
        }
    };

    useEffect(() => {
        fetchRandomMerch();
        fetchTopRecentUploads();
    }, []);

    return (
        <div>
            {randomMerch && (
                <div>
                    <a href={`/merch/${randomMerch.item_id}`}>
                        <img src={randomMerch.image_url} alt={randomMerch.name} style={{ maxWidth: '200px' }} />
                    </a>
                    <p>{randomMerch.name}</p>
                </div>
            )}

            <h2>Songs from people you follow</h2>
            {recentUploads.map((song) => (
                <div key={song.name}>
                    <p>{song.name} by {song.artist}</p>
                    <div className="SongPage-player-container">
                        <audio controls>
                            <source src={song.url} type="audio/mpeg" />
                            Your browser does not support the audio tag.
                        </audio>
                        <a href={song.url} download className="visually-hidden">Download</a>
                    </div>
                </div>
            ))}

            <p>I am signed in</p>
        </div>
    );
};

export default HomePageAuth;
