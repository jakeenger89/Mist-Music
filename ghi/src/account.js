import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
// import AllAccountSongs from './allAccountSongs';
import UserLikedSongs from './UserLikedSongs';
import FollowedUsersList from './FollowedUsersList';
import './account.css'

const Account = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [accountSongs, setAccountSongs] = useState([]);
  const [account_id, setAccountId] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchedUserData, setSearchedUserData] = useState(null);
  const [profile_picture_url, setProfilePic] = useState('');
  const [banner_url, setBannerPic] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const handleEditClick = () => {
    navigate('/edit-account', {
      state: {
        userData: {
          username,
          profile_picture_url: profile_picture_url,
          banner_url: banner_url,

        }}})
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('yourAuthToken');

        if (authToken) {
          const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
          const { account: { account_id, username } } = decodedToken;

          setAccountId(account_id);
          setUsername(username);

          console.log("Account ID:", account_id);

          const response = await fetch(`http://localhost:8000/user-songs/${account_id}`);
          const data = await response.json();

          setAccountSongs(data.songs);
        } else {
          console.error('Authentication token not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // const handleLogout = () => {
  //   localStorage.removeItem('yourAuthToken');
  //   setIsAuthenticated(false);
  //   navigate('/loginform');
  // };

const handleSearchUser = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/account?username=${searchUsername}`);
    if (response.ok) {
      const userData = await response.json();
      setSearchedUserData(userData);

      // Programmatically navigate to UserProfile component
      navigate(`/user-profile/${userData.account_id}`);
    } else {
      console.error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error searching for user:', error);
  }
};

  const handleSearchInputChange = async (event) => {
    const term = event.target.value;
    setSearchUsername(term);

    try {
      const response = await fetch('http://localhost:8000/api/accounts');
      if (response.ok) {
        const userData = await response.json();
        const allUsernames = userData.map(user => user.username);
        const filteredUsernames = allUsernames.filter(username =>
          username.toLowerCase().includes(term.toLowerCase())
        );
        setDropdownOptions(filteredUsernames);
      } else {
        console.error('Failed to fetch usernames');
        setDropdownOptions([]);
      }
    } catch (error) {
      console.error('Error fetching usernames:', error);
      setDropdownOptions([]);
    }
  };

  return (
    <div className="profile">
      <div className="col-12">
        <img src={banner_url} alt="banner" className="banner-image" />
        <button onClick={handleEditClick}>Edit</button>
      </div>
      <div className="offset-3 col-6">
        <img src={profile_picture_url} alt="Profile" className="profile-image" />
        <div className="shadow p-4 mt-4">
          <h1>Welcome {username}, to Mist Music!</h1>
          <p>This is a placeholder for your home page content.</p>

          <h2>
            <Link to={`/followed-users-list/${account_id}`}>Followed Users List</Link>
          </h2>

          <Routes>
            <Route path="followed-users-list/:account_id" element={<FollowedUsersList />} />
          </Routes>

          <h2>
            <Link to={`/account/liked-songs/${account_id}`}>Your Liked Songs</Link>
          </h2>
          <Routes>
            <Route path="liked-songs/:account_id" element={<UserLikedSongs account_id={account_id} />} />
          </Routes>

          <h2>
            <Link to={`/account/all-songs/${account_id}`}>Your Songs</Link>
          </h2>

          <ul>
            {accountSongs.map((song) => (
              <li key={song.song_id}>{song.name}</li>
            ))}
          </ul>

          <h2>Search for other users</h2>
          <div className="search-container">
            {/* Controlled input for search bar */}
            <input
              type="text"
              placeholder="Start typing a username"
              value={searchUsername}
              onChange={handleSearchInputChange}
            />
            {/* Suggestions list */}
            {searchUsername && dropdownOptions.length > 0 && (
              <div className="suggestions-list">
                {dropdownOptions.slice(0, 5).map((username) => (
                  <div
                    key={username}
                    className="suggestion-item"
                    onClick={() => setSearchUsername(username)}
                  >
                    {username}
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleSearchUser}>Search User</button>
          </div>

          {searchedUserData && (
            <div>
              <h3>User Information</h3>
              <p>Account ID: {searchedUserData.account_id}</p>
              <p>Email: {searchedUserData.email}</p>
              <p>Username: {searchedUserData.username}</p>
              <p>Currency: {searchedUserData.currency}</p>
              <Link to={`/account/liked-songs/${searchedUserData.account_id}`}>View Liked Songs</Link>
              <Link to={`/account/all-songs/${searchedUserData.account_id}`}>View Posted Songs</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
