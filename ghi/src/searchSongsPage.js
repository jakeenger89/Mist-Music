import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchSongsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        // Redirect to the search results page with the search term as a query parameter
        navigate(`/search_songs?search_term=${searchTerm}`);
    };

    return (
        <div className="container mt-5">
        <h1>Search Songs</h1>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchSongsPage;
