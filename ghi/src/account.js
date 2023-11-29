import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Account = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // You can add additional logic for logging out here
    // For now, let's clear the authentication status and redirect to the login page

    // Clear authentication status in localStorage
    localStorage.removeItem('isAuthenticated');

    // Redirect to the login page
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
          <h1>Welcome to the Generic Home Page!</h1>
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