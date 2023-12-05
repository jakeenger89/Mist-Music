import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import AllAccountSongs from './allAccountSongs';
import UserLikedSongs from './UserLikedSongs';

const Account = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [accountSongs, setAccountSongs] = useState([]);
  const [account_id, setAccountId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('yourAuthToken');

        if (authToken) {
          const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
          const { account: { account_id, username } } = decodedToken;

          setAccountId(account_id);
          setUsername(username);

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

  const handleLogout = () => {
    localStorage.removeItem('yourAuthToken');
    setIsAuthenticated(false);
    navigate('/loginform');
  };

  if (!isAuthenticated) {
    return (
      <div className="row">
        <div className="offset-3 col-6">
          <div className="shadow p-4 mt-4">
            <h1>Login Required</h1>
            <p>Please <Link to="/loginform">log in</Link> to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <h1>Welcome {username}, to Mist Music!</h1>
          <p>This is a placeholder for your home page content.</p>

          <h2>
            <Link to={`/account/liked-songs/${account_id}`}>Your Liked Songs</Link>
          </h2>

          <Routes>
            <Route
              path="liked-songs/:account_id"
              element={<UserLikedSongs account_id={account_id} />}
            />
          </Routes>

          <h2>
            <Link to={`/account/all-songs/${account_id}`}>Your Songs</Link>
          </h2>

          <ul>
            {accountSongs.map((song) => (
              <li key={song.song_id}>{song.name}</li>
            ))}
          </ul>

          <Routes>
            <Route
              path="all-songs/:account_id"
              element={<AllAccountSongs />}
            />
          </Routes>

          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
