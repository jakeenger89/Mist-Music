import { NavLink } from 'react-router-dom';

function Nav() {
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">MistMusic</NavLink>
                <NavLink className="navbar-brand" to="/loginform">Login</NavLink>
                <NavLink className="navbar-brand" to="/createsongform">Upload Song</NavLink>
            </div>
        </nav>
    )
}

export default Nav
