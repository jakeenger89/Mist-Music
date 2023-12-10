import React, { useState } from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput,
    MDBBtn,
} from "mdb-react-ui-kit";
//import { useNavigate } from 'react-router-dom'

const EditAccount = () => {
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
        event.preventDefault()

        let currentUserData = {};
        try {
            const response = await fetch(`http://localhost:8000/api/account/${account_id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch current user data.');
            }
            currentUserData = await response.json();
        } catch (error) {
            console.error('Error fetching current user data:', error);
            return; // Ensure to exit if fetching fails
        }

        const updatedata = {
            username: username || currentUserData.username,
            first_name: first_name || currentUserData.first_name,
            last_name: last_name || currentUserData.last_name,
            profile_picture_url: profile_picture_url || currentUserData.profile_picture_url,
            banner_url: banner_url || currentUserData.banner_url
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
    <MDBContainer fluid className="h-100" style={{ height: '100vh' }}>
            <MDBRow className="d-flex justify-content-center align-items-center h-100">
                <MDBCol md="10" lg="6" className="d-flex flex-column align-items-center">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4"style={{ color: 'white'}}>Edit Account</p>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <MDBIcon fas icon="user me-3" size="lg" />
                        <MDBInput type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <MDBIcon fas icon="user me-3" size="lg" />
                        <MDBInput type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name"/>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <MDBIcon fas icon="user me-3" size="lg" />
                        <MDBInput type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name"/>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <MDBIcon fas icon="image me-3" size="lg" />
                        <MDBInput type="text" value={profile_picture_url} onChange={(e) => setProfilePicture(e.target.value)} placeholder="Profile Picture URL"/>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <MDBIcon fas icon="image me-3" size="lg" />
                        <MDBInput type="text" value={banner_url} onChange={(e) => setBannerPic(e.target.value)} placeholder="Banner Picture URL"/>
                    </div>
                    <MDBBtn className="mb-4" size="lg" onClick={handleSubmit} style={{ backgroundColor: 'aqua', color: 'black' }}>
                        Save
                    </MDBBtn>
                </MDBCol>
            </MDBRow>
    </MDBContainer>
    )
}

export default EditAccount
