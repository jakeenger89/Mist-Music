import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Account = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Function to fetch username from the authentication token when the component mounts
    const fetchUsernameFromToken = () => {
      try {
        // Get the authentication token from localStorage
        const authToken = localStorage.getItem('yourAuthToken');

        if (authToken) {
          // Decode the token to get user information
          const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
          // Extract the username from the decoded token
          const { account: { username } } = decodedToken;
          console.log('Decoded Token:', decodedToken);

          setUsername(username);
          console.log('Updated username:', username);
        } else {
          console.error('Authentication token not found');
        }
      } catch (error) {
        console.error('Error decoding authentication token:', error);
      }
    };

    // Call the fetchUsernameFromToken function if the user is authenticated
    if (isAuthenticated) {
      fetchUsernameFromToken();
    }
  }, [isAuthenticated]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('yourAuthToken');
    setIsAuthenticated(false);
    // Additional logout logic if needed
    navigate('/loginform');
  };

  // Check if the user is authenticated
  if (!isAuthenticated) {
    // Render the "Login Required" message with a link to the login page
    return (
      <div className="row">
        <div className="offset-3 col-6">
          <div className="shadow p-4 mt-4">
            <h1>Login Required</h1>
            <p>
              Please <Link to="/loginform">log in</Link> to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If the user is authenticated, show the account content
  return (
    <div className="row">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <h1>Welcome {username}, to Mist Music!</h1>
          <p>This is a placeholder for your home page content.</p>

          {/* Logout button */}
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;