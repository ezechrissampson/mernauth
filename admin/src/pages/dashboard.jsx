import React from "react";
import { Link } from "react-router-dom";
import Usertable from "./usertable";
import { FaUserShield } from "react-icons/fa";

const AdminDashboard = () => {
  const users = [];

  return (
    <div className="vh-100 bg-light">
      
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a className="navbar-brand fw-bold" href="#">
          <FaUserShield className="me-2" />
          Admin Dashboard
        </a>
        <div className="ms-auto">
          <button className="btn btn-outline-light btn-sm"
          onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}>Logout</button>
          <Link className="btn btn-outline-light btn-sm ms-2" to="/admin/profile">Profile</Link>
        </div>
      </nav>


      <div className="container mt-4">
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary">Welcome, Admin</h3>
          <p className="text-muted">
            Manage users, view activities, and maintain full control over your
            authentication system.
          </p>
        </div>

        <Usertable users={users} />

        <footer className="text-center text-muted mt-5 mb-3" style={{ fontSize: "0.9rem" }}>
          Built with using <strong>MERN + Bootstrap</strong>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
