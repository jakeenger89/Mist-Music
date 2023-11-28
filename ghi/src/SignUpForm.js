import React, { useState, useEffect } from 'react';

const SignUpForm = () => {
    const[email, setEmail] = useState('')
    const[username, setUsername] = useState('')
    const[password, setPassword] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()
        const data = {
            email,
            username,
            password,
        }

        const MistURL = "http://localhost:8000/api/accounts/"
        const fetchOptions = {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(MistURL, fetchOptions)
        if (response.ok) {
            const newaccount = await response.json();
            setEmail('')
            setUsername('')
            setPassword('')
            window.location.reload()
        }
    };



    const handleChangeEmail = async (event) => {
        const { value } = event.target;
        setEmail(value);
    }
    const handleChangeUsername = async (event) => {
        const { value } = event.target;
        setUsername(value);
    }
    const handleChangePassword = async (event) => {
        const { value } = event.target;
        setPassword(value);
    }

    return (
        <div className="row">
            <div className="offset-3 col-6">
                <div className="shadow p-4 mt-4">
                    <h1>Create/Login</h1>
                    <form onSubmit={handleSubmit} id="create-account-form">
                    <div className="form-floating mb-3">
                            <input value={email} onChange={handleChangeEmail} placeholder="email" required type="text" name="email" id="email" className="form-control" />
                            <label htmlFor="email">Set Email</label>
                    </div>
                    <div className="form-floating mb-3">
                            <input value={username} onChange={handleChangeUsername} placeholder="username" required type="text" name="username" id="username" className="form-control" />
                            <label htmlFor="username">Set Username</label>
                    </div>
                    <div className="form-floating mb-3">
                            <input value={password} onChange={handleChangePassword} placeholder="password" required type="text" name="password" id="password" className="form-control" />
                            <label htmlFor="password">Set Password</label>
                    </div>
                        <button className="btn btn-primary">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default SignUpForm
