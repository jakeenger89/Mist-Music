import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom"

const HomePage = () => {
    const [randomMerch, setRandomMerch] = useState(null);



        const fetchRandomMerch = async () => {
            const url = `http://localhost:8000/api/merch/random`
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            if(response.ok) {
                const data = await response.json();
                setRandomMerch(data);
            } else {
                console.error('Could not get merch');
            }
        }
    useEffect(() => {
    fetchRandomMerch();
    }, []);


return (
    <div>
        {randomMerch && (
            <div>
                <Link to={`/merch/${randomMerch.item_id}`}><img src={randomMerch.image_url} alt={randomMerch.name} style={{ maxWidth: '200px'}} /></Link>
                <p>{randomMerch.name}</p>
            </div>
        )}
        <p>I'm not signed in</p>
    </div>
    )
}

export default HomePage
