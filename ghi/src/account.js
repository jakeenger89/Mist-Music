import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import UserLikedSongs from './UserLikedSongs';
import FollowedUsersList from './FollowedUsersList';
import './account.css';

const Account = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username] = useState('');
  const [accountSongs, setAccountSongs] = useState([]);
  const [account_id, setAccountId] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchedUserData, setSearchedUserData] = useState(null);
  const [profile_picture_url] = useState('https://img.freepik.com/free-photo/user-profile-icon-front-side-with-white-background_187299-40010.jpg?size=626&ext=jpg&ga=GA1.1.733290954.1702167185&semt=ais');
  const [banner_url] = useState('https://cdn.pixabay.com/photo/2016/02/03/08/32/banner-1176676_1280.jpg');
  const [currentUser, setCurrentUser] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [topRecentUploads, setTopRecentUploads] = useState([]);
  const [topRandomLikedSongs, setTopRandomLikedSongs] = useState([]);

  const handleEditClick = () => {
    navigate('/edit-account', {
      state: {
        userData: {
          username,
          profile_picture_url: profile_picture_url,
          banner_url: banner_url,
        },
      },
    });
  };

  const fetchTopRecentUploads = async () => {
    try {
      const authToken = localStorage.getItem('yourAuthToken');

      const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/random-recent-uploads`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const shuffledSongs = data.sort(() => Math.random() - 0.5).slice(0, 3);
        setTopRecentUploads(shuffledSongs);
      } else {
        console.error('Failed to fetch random recent uploads');
      }
    } catch (error) {
      console.error('Error fetching random recent uploads:', error);
    }
  };

  const fetchRandomLikedSongs = async (account_id) => {
    try {
      const authToken = localStorage.getItem('yourAuthToken');

      if (!account_id) {
        console.error('Account ID is null or undefined');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_HOST}/liked-songs/random/${account_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('Response from server:', response);

      if (response.ok) {
        const data = await response.json();
        console.log('Random liked songs:', data.songs);
        setTopRandomLikedSongs(data.songs);
      } else {
        console.error('Failed to fetch random liked songs');
      }
    } catch (error) {
      console.error('Error fetching random liked songs:', error);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('yourAuthToken');

      if (authToken) {
        const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
        const { account: { account_id } } = decodedToken;

        if (account_id) {
          setAccountId(account_id);

          const userDataResponse = await fetch(`${process.env.REACT_APP_API_HOST}/account/${account_id}`);
          if (userDataResponse.ok) {
            const userData = await userDataResponse.json();
            setCurrentUser(userData);
          } else {
            console.error('Failed to fetch user data');
          }

          const userSongsResponse = await fetch(`${process.env.REACT_APP_API_HOST}/user-songs/${account_id}`);
          if (userSongsResponse.ok) {
            const userSongsData = await userSongsResponse.json();
            setAccountSongs(userSongsData.songs);
          } else {
            console.error('Failed to fetch user songs');
          }

          fetchTopRecentUploads();
          fetchRandomLikedSongs(account_id);
        } else {
          console.error('Account ID is null or undefined');
        }
      } else {
        console.error('Authentication token not found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

  const handleSearchUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/account?username=${searchUsername}`);
      if (response.ok) {
        const userData = await response.json();
        setSearchedUserData(userData);
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
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/accounts`);
      if (response.ok) {
        const userData = await response.json();
        const allUsernames = userData.map((user) => user.username);
        const filteredUsernames = allUsernames.filter((username) =>
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
      <div className="container">
        <img src={currentUser.banner_url || banner_url} alt="banner" className="banner-image" />
        <h4 className="name-text">{currentUser.first_name} {currentUser.last_name}</h4>
        <img src={currentUser.profile_picture_url || profile_picture_url} alt="Profile" className="profile-image" />
        <button onClick={handleEditClick} className="edit-profile-button">
          Edit Profile
        </button>
      </div>
      <div className="offset-3 col-6" style={{ marginLeft: '-10px' }}>
        <div className="shadow p-4 mt-4">
          <div className="link-container">
            <Link className="profile-link" to={`/account/liked-songs/${account_id}`}>
              Liked Songs
            </Link>
            <Routes>
              <Route path="liked-songs/:account_id" element={<UserLikedSongs account_id={account_id} />} />
            </Routes>
            <Link className="profile-link" to={`/followed-users-list/${account_id}`}>
              Following
            </Link>
            <Routes>
              <Route path="followed-users-list/:account_id" element={<FollowedUsersList />} />
            </Routes>
            <Link className="profile-link" to={`/account/all-songs/${account_id}`}>
              Your Songs
            </Link>
          </div>
          <div className='welcome-link'>
            <h1>Welcome {currentUser.username}, to Mist Music!</h1>
            <hr className="full-width-line" />
          </div>
          <ul className="song-list">
            {accountSongs.map((song) => (
              <li key={song.song_id}>{song.name}</li>
            ))}
          </ul>
          <h2>Search Users</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Start typing a username"
              value={searchUsername}
              onChange={handleSearchInputChange}
            />
            {searchUsername && dropdownOptions.length > 0 && (
              <div className="suggestions-list">
                {dropdownOptions.slice(0, 5).map((username) => (
                  <div key={username} className="suggestion-item" onClick={() => setSearchUsername(username)}>
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
          <div className="top-recent">
          <h4 style={{color: "white"}}>Top Recent Uploads</h4>
          {topRecentUploads.map((song) => (
            <div className="song-player" key={song.song_id}>
              <p>
                {song.name} by {song.artist}
              </p>
              <div className="SongPage-player-contain">
                <audio controls>
                  <source src={song.url} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
                <a href={song.url} download className="visually-hidden">
                  Download
                </a>
              </div>
            </div>
          ))}
          </div>
          <div className="top-liked">
          <h4 style={{color: "white"}}>Random Liked Songs</h4>
          {topRandomLikedSongs.map((song) => (
            <div className="song-player" key={song.song_id}>
              <p>
                {song.name} by {song.artist}
              </p>
              <div className="SongPage-player-contain">
                <audio controls>
                  <source src={song.url} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
                <a href={song.url} download className="visually-hidden">
                  Download
                </a>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
