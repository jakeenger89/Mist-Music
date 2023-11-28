import React, { useState } from 'react';

const AccountForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()
        const data = { email, password }
        const MistURL = "http://localhost:8000/api/accounts/"
        const fetchOptions = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }
        try {
            const response = await fetch(MistURL, fetchOptions)
            if (response.ok) {
                const newaccount= await response.json();
                setEmail('')
                setPassword('')
            }
        } catch (error) {

        }
    }

const handleChangeEmail = (event) => {
    const { value } = event.target;
    setEmail(value);
}
const handleChangePassword = async (event) => {
    const { value } = event.target;
    setPassword(value);
}

return(
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
                            <input value={password} onChange={handleChangePassword} placeholder="password" required type="text" name="password" id="password" className="form-control" />
                            <label htmlFor="password">Password</label>
                        </div>
                        <button className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AccountForm
