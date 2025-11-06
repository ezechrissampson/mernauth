import React from "react";
import { FaUserShield } from "react-icons/fa";
import { Link } from "react-router-dom";

const Profile = () => {

    return(
    <div className="vh-100 bg-light">

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a className="navbar-brand fw-bold" href="#">
          <FaUserShield className="me-2" />
          Admin Dashboard
        </a>
        <div className="ms-auto">
          <button className="btn btn-outline-light btn-sm">Logout</button>
          <Link className="btn btn-outline-light btn-sm ms-2" to="/admin/profile">Profile</Link>
        </div>
      </nav>

      
    </div>
    )
}

export default Profile;