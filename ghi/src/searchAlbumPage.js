import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchAlbumPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        // Redirect to the search results page with the search term as a query parameter
        navigate(`/search_albums?search_term=${searchTerm}`);
    };

    return (
        <div className="container mt-5">
        <h1>Search Albums</h1>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchAlbumPage;
