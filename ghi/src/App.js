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

  return (
    <BrowserRouter>
      <Nav isAuthenticated={isAuthenticated} />
      <div className="container">
        <Routes>
          <Route index path="account/*" element={<Account isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
          <Route index path="signupform" element={<SignUpForm />} />
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
          <Route index path="account/all-songs/:account_id" element={<AllAccountSongs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
