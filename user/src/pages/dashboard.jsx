import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const user = {
    fullName: "Ezekiel Sampson",
    username: "ezechrissampson",
    email: "ezechrissampson@gmail.com",
  };

  const handleLogout = () => {
    console.log("User logged out");
    // TODO: Clear auth token and redirect to login
  };

  return (
    <div className="vh-100 bg-light">
      {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a className="navbar-brand fw-bold" href="#">
          MERN Auth Project
        </a>
        <div className="ms-auto">
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
           <Link to="/profile" className="btn btn-outline-light btn-sm ms-2">
            Profile
          </Link>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mt-5">
        <div className="text-center">
          <FaUserCircle className="text-primary mb-3" size={80} />
          <h3 className="fw-bold">Welcome, {user.fullName}</h3>
          <p className="text-muted mb-4">
            Glad to have you back! Here’s your dashboard overview.
          </p>

          <div className="card mx-auto shadow-sm" style={{ maxWidth: "450px" }}>
            <div className="card-body text-start">
              <h5 className="fw-semibold mb-3 text-primary">Your Details</h5>
              <p>
                <strong>Full Name:</strong> {user.fullName}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <button className="btn btn-primary w-100 mt-3" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <p className="text-muted mt-4">
            Built with using <strong>MERN & Bootstrap</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
