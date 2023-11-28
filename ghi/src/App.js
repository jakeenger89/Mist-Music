import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Construct from "./Construct.js";
import ErrorNotification from "./ErrorNotification";
import "./App.css";
import Nav from './Nav'
import AccountForm from "./LoginForm.js";
import CreateSongForm from "./CreateSongForm.js";
import SignUpForm from "./SignUpForm.js";
import MerchList from "./merch.js";
import Account from "./account.js";

function App() {
  const [launchInfo, setLaunchInfo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      let url = `${process.env.REACT_APP_API_HOST}/api/launch-details`;
      console.log("fastapi url: ", url);
      let response = await fetch(url);
      console.log("------- hello? -------");
      let data = await response.json();

      if (response.ok) {
        console.log("got launch data!");
        setLaunchInfo(data.launch_details);
      } else {
        console.log("drat! something happened");
        setError(data.message);
      }
    }
    getData();
  }, []);

  return (
    <BrowserRouter>
      <Nav />
      <div className="container">
        <Routes>
          <Route index path ="account" element={<Account/>}></Route>
          <Route index path ="signupform" element ={<SignUpForm/>}></Route>
          <Route index path="loginform" element={<AccountForm/>}></Route>
          <Route index path="createsongform" element={<CreateSongForm/>}></Route>
          <Route index path="merch" element={<MerchList/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
