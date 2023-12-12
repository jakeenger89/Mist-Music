import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const SearchSongsResults = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search_term') || '';
    console.log("the searchQuery", searchQuery)
    console.log("the queryParams", queryParams)
    console.log('Full URL:', location.pathname + location.search);
    const [results, setResults] = useState([]);

    useEffect(() => {
        // Fetch search results based on the searchQuery
        // Update the results state with the fetched data
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/search_songs?search_term=${searchQuery}`);
                console.log("response", response)
                if (!response.ok){
                    throw new Error("Network response was not ok")
                }
                const data = await response.json();
                setResults(data);
                console.log("this is the results", data);
            } catch (error) {
                console.log("error fetching search results:", error)
            }
        };
        console.log("the results are:", results)

        fetchUserData();
        setResults();
    }, [searchQuery, results]);

return (
        <div className="container mt-5">
            <h1>Search Results</h1>
            <p>Showing results for: {searchQuery}</p>
            <ul>
                {results && results.map((result) => (
                    <li className="searchResults-container">
                        <Link to={`/songs/${result.song_id}`}>{result.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchSongsResults;
