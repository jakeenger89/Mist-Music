import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
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
import SearchUserPage from "./searchUserPage";
import SearchUserResults from "./searchUserResults";
import SearchSongsPage from "./searchSongsPage";
import SearchSongsResults from "./searchSongsResults";
import SearchAlbumPage from "./searchAlbumPage";
import SearchAlbumResults from "./searchAlbumResults";
import AboutUs from "./aboutUs";
import UserLikedSongs from "./UserLikedSongs";
import SongPage from "./songpage";
import CreateAlbumForm from "./CreateAlbumForm";
import AllAlbums from "./AllAlbums";
import UserProfile from "./UserProfile";
import FollowedUsersList from "./FollowedUsersList";
import EditAccount from "./edit";
import ThankYouPage from "./merchandise/purchaseTrue";
import AlbumEdit from "./albumEdit";
import CoinList from "./merchandise/coinlist";
import CoinSuccess from "./merchandise/fundsAdd";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("yourAuthToken"))
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("yourAuthToken");
    if (storedToken) {
      // You may want to validate the token on the server side as well
      setIsAuthenticated(true);
    }
  }, []);

  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, "");
  return (
    <BrowserRouter basename={basename}>
      <Nav isAuthenticated={isAuthenticated} />
      <div className="container">
        <Routes>
          <Route
            index
            path="/"
            element={isAuthenticated ? <Account /> : <AccountForm />}
          />
          <Route path="account/:account_id" element={<Account />} />
          <Route
            index
            path="account/*"
            element={
              <Account
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route index path="signupform" element={<SignUpForm />} />
          <Route path="edit-account" element={<EditAccount />} />
          <Route
            index
            path="createalbumform"
            element={
              <AuthenticatedRoute
                element={<CreateAlbumForm isAuthenticated={isAuthenticated} />}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            index
            path="loginform"
            element={<AccountForm setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route index path="search_user" element={<SearchUserPage />} />
          <Route index path="search_accounts" element={<SearchUserResults />} />
          <Route index path="search_song" element={<SearchSongsPage />} />
          <Route index path="search_songs" element={<SearchSongsResults />} />
          <Route index path="search_album" element={<SearchAlbumPage />} />
          <Route index path="search_albums" element={<SearchAlbumResults />} />
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
          <Route index path="allsongs" element={<AllSongs />} />
          <Route index path="merch/:item_id" element={<OrderForm />} />
          <Route index path="merch/thankyou" element={<ThankYouPage />} />
          <Route index path="coins" element={<CoinList />} />
          <Route index path="coins/success" element={<CoinSuccess />} />

          <Route index path="allalbums" element={<AllAlbums />} />
          <Route
            path="albums/:albumId/edit"
            element={<AlbumEdit isAuthenticated={isAuthenticated} />}
          />

          <Route
            index
            path="account/all-songs/:account_id"
            element={<AllAccountSongs />}
          />
          <Route
            index
            path="account/liked-songs/:account_id"
            element={
              <UserLikedSongs
                account_data={{ username: "your_username_here" }}
              />
            }
          />
          <Route
            index
            path="update-song/:song_id"
            element={<UpdateSongForm />}
          />
          <Route index path="aboutus" element={<AboutUs />} />
          <Route index path="songs/:song_id" element={<SongPage />} />
          <Route
            index
            path="user-profile/:account_id"
            element={<UserProfile />}
          />
          <Route
            path="/user-liked-songs/:account_id"
            element={<UserLikedSongs />}
          />
          <Route
            index
            path="/followed-users-list/:account_id"
            element={<FollowedUsersList />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
