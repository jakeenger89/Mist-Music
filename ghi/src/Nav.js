import { NavLink } from 'react-router-dom';
import "./style.css"

function Nav() {
    return(
        <nav className="nav">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <img src="https://i.imgur.com/oGvU6bt.png" alt="Logo" className="navbar-logo"/>
                </NavLink>
                <NavLink className="navbar-brand" to="/createsongform">Upload Song</NavLink>
                <NavLink className="navbar-brand" to="/signupform">Sign Up Form</NavLink>
                <NavLink className="navbar-brand" to="/merch">Merchandise</NavLink>
                <NavLink className="navbar-brand" to="/loginform">Login</NavLink>
            </div>
        </nav>
    )
}

export default Nav
