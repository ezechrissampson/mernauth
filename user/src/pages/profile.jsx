import React from 'react'
import { Link } from 'react-router-dom';

const Profile = () => {
    
    return(
        <div className="vh-100 bg-light">
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
    <a className="navbar-brand fw-bold" href="#">
    MERN Auth Project
    </a>
    <div className="ms-auto">
    <button className="btn btn-outline-light btn-sm">
    Logout
    </button>
    <Link to="/profile" className="btn btn-outline-light btn-sm ms-2">
     Profile
    </Link>
    </div>
   </nav>
        </div>
    )
}
export default Profile;