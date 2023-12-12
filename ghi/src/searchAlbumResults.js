import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SearchAlbumResults = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search_term') || '';
    console.log("the searchQuery", searchQuery)
    console.log("the quereParams", queryParams)
    console.log('Full URL:', location.pathname + location.search);
    const [results, setResults] = useState([]);

    useEffect(() => {
        // Fetch search results based on the searchQuery
        // Update the results state with the fetched data
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/search_albums?search_term=${searchQuery}`);
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
    },  [searchQuery, results]);

return (
        <div className="container mt-5">
            <h1>Search Results</h1>
            <p>Showing results for: {searchQuery}</p>
            <ul>
                {results && results.map((result) => (
                    <li className="searchResults-container" key={result.album_id}>{result.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchAlbumResults;
