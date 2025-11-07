import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserShield, FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";

const Profile = () => {
  const [admin, setAdmin] = useState({
    username: "Ezechrissam",
    email: "ezechrissampson@gmail.com",
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert("Admin username updated successfully!");
  };

  const handleUpdatePin = (e) => {
    e.preventDefault();
    if (admin.newPin !== admin.confirmPin) {
      alert("Pins do not match!");
      return;
    }
    alert("PIN updated successfully!");
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a className="navbar-brand fw-bold" href="#">
          <FaUserShield className="me-2" />
          Admin Profile
        </a>
        <div className="ms-auto">
          <Link to="/admin/dashboard" className="btn btn-outline-light btn-sm">Dashboard</Link>
          <button className="btn btn-outline-light btn-sm ms-2">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "700px" }}>
          <h3 className="fw-bold text-center text-primary mb-4">Admin Account Settings</h3>

          {/* Username + Email */}
          <form onSubmit={handleUpdateProfile}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={admin.username}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email (Set)</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={admin.email}
                  readOnly
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-4">
                Update Username
              </button>
            </div>
          </form>

          {/* PIN Section */}
          <div className="mt-5">
            <h5 className="fw-bold text-secondary mb-3">
              <FaKey className="me-2" />
              Change Admin PIN
            </h5>

            <form onSubmit={handleUpdatePin}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Old PIN</label>
                  <input
                    type="password"
                    maxLength="6"
                    className="form-control"
                    name="oldPin"
                    value={admin.oldPin}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">New PIN</label>
                  <input
                    type="password"
                    maxLength="6"
                    className="form-control"
                    name="newPin"
                    value={admin.newPin}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Confirm PIN</label>
                  <input
                    type="password"
                    maxLength="6"
                    className="form-control"
                    name="confirmPin"
                    value={admin.confirmPin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="text-center mt-4">
                <button type="submit" className="btn btn-outline-primary px-4">
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
