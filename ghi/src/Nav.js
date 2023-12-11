// Nav.js
import { NavLink, useNavigate } from "react-router-dom";
import "./navstyle.css";

function Nav({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("yourAuthToken");
    if (onLogout) {
      onLogout();
    }
    navigate("/loginform");
    window.location.reload()
  };
  return (
    <nav className="nav">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img src="https://i.imgur.com/oGvU6bt.png" alt="Logo" className="navbar-logo"/>
        </NavLink>
        <NavLink className="navbar-brand" to="/merch">
          Merchandise
        </NavLink>
        <NavLink className="navbar-brand" to="/allalbums">
          All Albums
        </NavLink>
        <NavLink className={"navbar-brand"} to="/allsongs">
          All Songs
        </NavLink>
        <NavLink className={"navbar-brand"} to="/search_album">
          Search Albums
        </NavLink>
          <NavLink className={"navbar-brand"} to="/search_song">
          Search Songs
        </NavLink>
        <NavLink className={"navbar-brand"} to="/search_user">
          Search Users
        </NavLink>
        {isAuthenticated && (
          <NavLink className="navbar-brand" to="/createalbumform">
          Upload Album
        </NavLink>
        )}
        {!isAuthenticated && (
          <NavLink className="navbar-brand" to="/signupform">
            Sign Up
          </NavLink>
        )}
        {isAuthenticated && (
          <NavLink className="navbar-brand" to="/createsongform">
            Upload Song
          </NavLink>
        )}
        {isAuthenticated && (
          <NavLink className={"navbar-brand"} to="/account">
            My Profile
          </NavLink>
        )}
        {!isAuthenticated && (
          <NavLink className="navbar-brand" to="/loginform">
            Login
          </NavLink>
        )}
        <NavLink className={"navbar-brand"} to="/aboutus">
          About Us
        </NavLink>
        {isAuthenticated && (
          <button className="navbar-brand logout-button" onClick={handleLogout}>
          Logout
        </button>
        )}
      </div>
    </nav>
  );
}

export default Nav;
