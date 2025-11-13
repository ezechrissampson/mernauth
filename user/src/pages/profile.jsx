import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaLock } from "react-icons/fa";
import axios from "axios";

const Profile = () => {

  const [user, setUser] = useState(null);

  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePic: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });



    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePic: URL.createObjectURL(file) });
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    alert("Password changed successfully!");
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a className="navbar-brand fw-bold" href="#">
          User Profile
        </a>
        <div className="ms-auto">
          <button className="btn btn-outline-light btn-sm"
          onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          
          >Logout</button>
          <Link to="/dashboard" className="btn btn-outline-light btn-sm ms-2">Dashboard</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "700px" }}>
          <h3 className="fw-bold text-center text-primary mb-4">My Profile</h3>

          <div className="text-center mb-4">
            {profile.profilePic ? (
              <img
                src={profile.profilePic}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: "110px", height: "110px", objectFit: "cover" }}
              />
            ) : (
              <FaUserCircle className="text-primary mb-3" size={110} />
            )}
            <div className="mt-2">
              <label className="btn btn-outline-primary btn-sm">
                Upload Picture
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Profile Update */}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={user.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={user.email}
                  readOnly
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-4">
                Save Changes
              </button>
            </div>
          </form>

          {/* Password Section */}
          <div className="mt-5">
            <h5 className="fw-bold text-secondary mb-3">
              <FaLock className="me-2" />
              Change Password
            </h5>

            <form onSubmit={handlePasswordUpdate}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Old Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="oldPassword"
                    value={profile.oldPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={profile.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="text-center mt-4">
                <button type="submit" className="btn btn-outline-primary px-4">
                  Update Password
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
