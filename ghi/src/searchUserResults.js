import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./account.css";
import "./searchPage.css";
const SearchUserResults = () => {
  const location = useLocation();
  // grabs the location of the requested url.
  const queryParams = new URLSearchParams(location.search);
  // properly pulls the search_term query in the url.
  const searchQuery = queryParams.get("search_term") || "";
  console.log("the searchQuery", searchQuery);
  console.log("the quereParams", queryParams);
  // check to see if I am getting the correct URL when I am inputting a search.
  console.log("Full URL:", location.pathname + location.search);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch search results based on the searchQuery
    // Update the results state with the fetched data
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/api/search_accounts?search_term=${searchQuery}`
        );
        console.log("response", response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setResults(data);
        console.log("this is the results", data);
      } catch (error) {
        console.log("error fetching search results:", error);
      }
    };
    console.log("the results are:", results);

    fetchUserData();
    setResults();
  }, [searchQuery, results]);

  return (
    <div className="searchBar-container mt-4">
      <h1>Search Results</h1>
      <p>Showing results for: {searchQuery}</p>
      <ul>
        {results &&
          results.map((result) => (
            <li className="searchResults-container">
              <Link to={`/user-profile/${result.account_id}`}>
                {result.username}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SearchUserResults;
