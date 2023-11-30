import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountForm = ({ setIsAuthenticated, setUserId }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    async function handleSubmit(event) {
    event.preventDefault();
    const data = { username: email, password };

    try {
        const response = await fetch("http://localhost:8000/token", {
        method: "POST",
        body: new URLSearchParams(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (response.ok) {
        // Parse the response to get the authentication token
        const { access_token, account_id } = await response.json();

        // Store the authentication token in localStorage
        localStorage.setItem('yourAuthToken', access_token);

        // Update the authentication status in App component
        setIsAuthenticated(true);

        // Save authentication status in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', account_id);


        // Use navigate to redirect without a full page reload
        navigate('/account');
        setUserId(account_id);

        // Optionally, you can clear the form fields or perform other actions
        setEmail('');
        setPassword('');
        } else {
        // Handle login failure
        const errorResponse = await response.json();
        console.error('Login failed:', errorResponse);
        }
    } catch (error) {
      // Handle fetch error
        console.error('Fetch error:', error);
    }
}

const handleChangeEmail = (event) => {
    const { value } = event.target;
    setEmail(value);
};

const handleChangePassword = (event) => {
    const { value } = event.target;
    setPassword(value);
};

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '200px'}}>
            <div style={{ border: '4px solid black', padding: '20px', backgroundColor: '#ddd', borderRadius: '5px'}}>
                <div className="shadow p-4 mt-4">
                    <h1 style={{ textAlign: 'center' }}>Login</h1>
                    <form onSubmit={handleSubmit} id="create-account-form">
                    <div style={{marginTop: '10px'}} className="form-floating mb-3">
                        <input value={email} onChange={handleChangeEmail} placeholder="email" required type="text" name="email" id="email" className="form-control" />
                        <label htmlFor="email"></label>
                    </div>
                    <div style={{marginTop: '10px'}} className="form-floating mb-3">
                        <input value={password} onChange={handleChangePassword} placeholder="password" required type="password" name="password" id="password" className="form-control" />
                        <label htmlFor="password"></label>
                    </div>
                    <button style={{ backgroundColor: 'black', width: '100%', color: 'white', borderRadius: '5px', padding: "5x", marginTop: '10px'}}type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountForm;
