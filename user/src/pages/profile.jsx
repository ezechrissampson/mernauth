import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaLock } from "react-icons/fa";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);


  const [profileForm, setProfileForm] = useState({ name: "", email: "" });


  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [imageMessage, setImageMessage] = useState("");
  const [imageError, setImageError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setProfileForm({
          name: res.data.name || "",
          email: res.data.email || "",
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  if (!user) return <div className="text-center mt-5">Loading...</div>;


  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageMessage("");
    setImageError("");


    const previewUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, profilePic: previewUrl }));

    // send to backend (if you have endpoint for it)
    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await axios.put(
        "http://localhost:5000/api/auth/profile/image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data);
      setImageMessage("Profile picture updated successfully");
    } catch (err) {
      setImageError(err.response?.data?.message || "Failed to update image");
    }
  };


  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        profileForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
      setProfileMessage("Profile updated successfully");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Update failed");
    }
  };


  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/api/auth/profile/password",
        { oldPassword, newPassword, confirmPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordMessage("Password updated successfully");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to update password"
      );
    }
  };

  const handleLogout = async () => {
  const token = localStorage.getItem("token");

  try {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Logout error", err.response?.data || err.message);
  } finally {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};

  return (
    <div className="bg-light min-vh-100">

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a className="navbar-brand fw-bold" href="#">
          User Profile
        </a>
        <div className="ms-auto">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => {
              handleLogout
            }}
          >
            Logout
          </button>
          <Link
            to="/dashboard"
            className="btn btn-outline-light btn-sm ms-2"
          >
            Dashboard
          </Link>
        </div>
      </nav>

   
      <div className="container py-5">
        <div
          className="card shadow-lg p-4 mx-auto"
          style={{ maxWidth: "700px" }}
        >
          <h3 className="fw-bold text-center text-primary mb-4">My Profile</h3>

 
          <div className="text-center mb-4">
            {user.profilePic ? (
              <img
                  src={
                  user.profilePic?.startsWith("http")
                  ? user.profilePic
                  : `http://localhost:5000/${user.profilePic}`
  }

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
            {imageMessage && (
              <div className="alert alert-success mt-3">{imageMessage}</div>
            )}
            {imageError && (
              <div className="alert alert-danger mt-3">{imageError}</div>
            )}
          </div>

     
          <form onSubmit={handleProfileUpdate}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-4">
                Save Changes
              </button>
            </div>
            {profileMessage && (
              <div className="alert alert-success mt-3">
                {profileMessage}
              </div>
            )}
            {profileError && (
              <div className="alert alert-danger mt-3">{profileError}</div>
            )}
          </form>

          <div className="mt-5">
            <h5 className="fw-bold text-secondary mb-3">
              <FaLock className="me-2" />
              Change Password
            </h5>

            <form onSubmit={handlePasswordUpdate}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Old Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              <div className="text-center mt-4">
                <button type="submit" className="btn btn-outline-primary px-4">
                  Update Password
                </button>
              </div>
            </form>

            {passwordMessage && (
              <div className="alert alert-success mt-3">
                {passwordMessage}
              </div>
            )}
            {passwordError && (
              <div className="alert alert-danger mt-3">{passwordError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
