import { NavLink, useNavigate } from 'react-router-dom';
import "./style.css"

function Nav({ isAuthenticated, onLogout }) {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('yourAuthToken')
        if (onLogout) {
            onLogout()
        }
        navigate('/loginform')

    }
    return(
        <nav className="nav">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <img src="https://i.imgur.com/oGvU6bt.png" alt="Logo" className="navbar-logo"/>
                </NavLink>
                {isAuthenticated && <NavLink className="navbar-brand" to="/createsongform">Upload Song</NavLink>}
                <NavLink className={"navbar-brand"} to="/allsongs">Search Songs</NavLink>
                {!isAuthenticated && <NavLink className="navbar-brand" to="/signupform">Sign Up Form</NavLink>}
                <NavLink className="navbar-brand" to="/merch">Merchandise</NavLink>
                {!isAuthenticated && <NavLink className="navbar-brand" to="/loginform">Login</NavLink>}
                {isAuthenticated && <button className="navbar-brand" onClick={handleLogout}>Logout</button>}
            </div>
        </nav>
    )
}

export default Nav
