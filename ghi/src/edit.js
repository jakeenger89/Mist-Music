import React, { useState } from 'react';

const EditAccout = () => {
    const [username, setUsername] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [profile_picture_url, setProfilePicture] = useState("")
    const [banner_url, setBannerPic] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
    }

return (
    <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)}/>
        <input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)}/>
        <input type="text" value={profile_picture_url} onChange={(e) => setProfilePicture(e.target.value)}/>
        <input type="text" value={banner_url} onChange={(e) => setBannerPic(e.target.value)}/>
    <button type="submit">Save</button>
    </form>
)
}

export default EditAccout
