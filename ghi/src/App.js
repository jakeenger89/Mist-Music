import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Nav from "./Nav";
import AccountForm from "./LoginForm";
import CreateSongForm from "./CreateSongForm";
import SignUpForm from "./SignUpForm";
import MerchList from "./merchandise/merch";
import Account from "./account";
import AuthenticatedRoute from "./authentication";
import AllSongs from "./seachsongs";
import OrderForm from "./merchandise/merchdetail";
import AllAccountSongs from "./allAccountSongs";
import UpdateSongForm from "./updateSongForm";
import AboutUs from "./aboutUs";
import UserLikedSongs from "./UserLikedSongs";
import SongPage from "./songpage";
import UserProfile from "./UserProfile";
import FollowedUsersList from "./FollowedUsersList";
import EditAccount from "./edit"


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("yourAuthToken"))
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('yourAuthToken');
    if (storedToken) {
      // You may want to validate the token on the server side as well
      setIsAuthenticated(true);
    }
  }, []);

  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, '');

  return (
    <BrowserRouter basename={basename}>
      <Nav isAuthenticated={isAuthenticated} />
      <div className="container">
        <Routes>
          <Route path="account/:account_id" element={<Account />} />
          <Route
            index
            path="account/*"
            element={<Account isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route index path="signupform" element={<SignUpForm />} />
          <Route path="edit-account" element={<EditAccount/>}/>
          <Route
            index
            path="loginform"
            element={<AccountForm setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            index
            path="createsongform"
            element={
              <AuthenticatedRoute
                element={<CreateSongForm isAuthenticated={isAuthenticated} />}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route index path="merch" element={<MerchList />} />
          <Route index path="allsongs" element={<AllSongs />} /> {/* Add this line */}
          <Route index path="merch/:item_id" element={<OrderForm />} />
          <Route
            index
            path="account/all-songs/:account_id"
            element={<AllAccountSongs />}
          />
          <Route
            index
            path="account/liked-songs/:account_id"
            element={<UserLikedSongs account_data={{ username: 'your_username_here' }} />}
          />
          <Route
            index
            path="update-song/:song_id"
            element={<UpdateSongForm />}
          />
          <Route index path="aboutus" element={<AboutUs />} />
          <Route index path="songs/:song_id" element={<SongPage />} />
          <Route index path="user-profile/:account_id" element={<UserProfile />} />
          <Route path="/user-liked-songs/:account_id" element={<UserLikedSongs />} />
          <Route index path="/followed-users-list/:account_id" element={<FollowedUsersList />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
