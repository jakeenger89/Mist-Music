import React, {useState, useEffect} from 'react'

function Profile ({account_id}) {
    const [account, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:8000/api/account/${account_id}`)
    }
    )
    return (
        <div className="user-profile">
            <h1>{account.name}</h1>
            <p>Email: {account.email}</p>
            <p>Username: {account.username}</p>
        </div>
    )
}

export default Profile
