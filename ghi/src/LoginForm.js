import React, { useState } from 'react';

const AccountForm = () => {
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
                // Redirect to the home page after successful login
                window.location.href = '/account'; // Change '/' to the desired route

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
        <div className="row">
            <div className="offset-3 col-6">
                <div className="shadow p-4 mt-4">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit} id="create-account-form">
                        <div className="form-floating mb-3">
                            <input value={email} onChange={handleChangeEmail} placeholder="email" required type="text" name="email" id="email" className="form-control" />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input value={password} onChange={handleChangePassword} placeholder="password" required type="password" name="password" id="password" className="form-control" />
                            <label htmlFor="password">Password</label>
                        </div>
                        <button className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountForm;
