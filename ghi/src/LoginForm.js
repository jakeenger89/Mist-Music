import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";

const AccountForm = ({ setIsAuthenticated, setUserId }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const data = { username: email, password };

    try {
      const response = await fetch("http://localhost:8000/token", {
        method: "POST",
        body: new URLSearchParams(data),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.ok) {
        // Parse the response to get the authentication token
        const { access_token, account_id } = await response.json();

        // Store the authentication token in localStorage
        localStorage.setItem("yourAuthToken", access_token);
        console.log("Token stored:", access_token);

        // Update the authentication status in App component
        setIsAuthenticated(true);

        // Save authentication status in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userId", account_id);

        // Use navigate to redirect without a full page reload
        navigate("/account");
        setUserId(account_id);

        // Optionally, you can clear the form fields or perform other actions
        setEmail("");
        setPassword("");
      } else {
        // Handle login failure
        const errorResponse = await response.json();
        console.error("Login failed:", errorResponse);
      }
    } catch (error) {
      // Handle fetch error
      console.error("Fetch error:", error);
    }
  }

  const handleChangeEmail = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handleChangePassword = (event) => {
    const { value } = event.target;
    setPassword(value);
  };

  return (
    <MDBContainer fluid className="h-100">
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol
          md="10"
          lg="6"
          className="order-2 order-lg-1 d-flex flex-column align-items-center"
        >
          <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login</p>

          <div className="d-flex flex-row align-items-center mb-4">
            <MDBIcon fas icon="envelope me-3" size="lg" />
            <MDBInput
              label="Email"
              id="form2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="d-flex flex-row align-items-center mb-4">
            <MDBIcon fas icon="lock me-3" size="lg" />
            <MDBInput
              label="Password"
              id="form3"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <MDBBtn className="mb-4" size="lg" onClick={handleSubmit}>
            Login
          </MDBBtn>
        </MDBCol>

        <MDBCol
          md="10"
          lg="6"
          className="order-1 order-lg-2 d-flex align-items-center justify-content-center"
        >
          <img
            src="https://i.imgur.com/oGvU6bt.png"
            alt="Login"
            className="img-fluid"
            style={{ borderRadius: "25px", marginRight: "70px" }}
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default AccountForm;
