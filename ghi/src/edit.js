import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const EditAccout = ({}) => {
    const [username, setUsername] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [profile_picture_url, setProfilePicture] = useState("")
    const [banner_url, setBannerPic] = useState("")

    const authToken = localStorage.getItem('yourAuthToken')
    const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
    console.log('Decoded Token:', decodedToken);
    const account_id = decodedToken.account.account_id;
    console.log(account_id);

    const handleSubmit = async (event) => {
        console.log("called")
        event.preventDefault()

        const updatedata = {
            username,
            first_name,
            last_name,
            profile_picture_url,
            banner_url
        }
        try {
            const response = await fetch(`http://localhost:8000/api/account/${account_id}` , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updatedata)
            })
            if (!response.ok) {
                throw new Error('HTTP ERROR')
            }
            const data = await response.json()
            console.log('success', data)
            } catch (error) {
                console.log('Error posting')
        }
    }
return (
    <form onSubmit={handleSubmit}>
        <input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input placeholder="first name" type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)}/>
        <input placeholder="last name" type="text" value={last_name} onChange={(e) => setLastName(e.target.value)}/>
        <input placeholder="profile picture URL" type="text" value={profile_picture_url} onChange={(e) => setProfilePicture(e.target.value)}/>
        <input placeholder="banner picture URL" type="text" value={banner_url} onChange={(e) => setBannerPic(e.target.value)}/>
        <button type="submit">Save</button>
    </form>
    )
}

export default EditAccout
