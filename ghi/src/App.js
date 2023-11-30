import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './Nav';
import AccountForm from "./LoginForm.js";
import CreateSongForm from "./CreateSongForm.js";
import SignUpForm from "./SignUpForm.js";
import MerchList from "./merch.js";
import Account from "./account.js";

function App() {
  const [launchInfo, setLaunchInfo] = useState([]);
  const [error, setError] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    async function getData() {
    }
    getData();
  }, []);

  return (
    <BrowserRouter>
      <Nav isAuthenticated={isAuthenticated} />
      <div className="container">
        <Routes>
          <Route index path="account" element={<Account isAuthenticated={isAuthenticated} />} />
          <Route index path="signupform" element={<SignUpForm />} />
          <Route index path="loginform" element={<AccountForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route index path="createsongform" element={<CreateSongForm />} />
          <Route index path="merch" element={<MerchList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
