import React, { useState, useEffect } from "react";
import { FaUserShield, FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [form, setForm] = useState({ username: "", email: "" });
  const [pinForm, setPinForm] = useState({
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pinMessage, setPinMessage] = useState("");
  const [pinError, setPinError] = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchProfile = () => {
    axios
      .get("http://localhost:5000/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAdmin(res.data);
        setForm({ username: res.data.username, email: res.data.email });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePinChange = (e) => {
    setPinForm({ ...pinForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/admin/profile",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmin(res.data);
      setMessage("Profile updated successfully");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      setMessage("");
    }
  };

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    setPinMessage("");
    setPinError("");

    try {
      const res = await axios.put(
        "http://localhost:5000/api/admin/profile/pin",
        pinForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPinMessage(res.data.message || "PIN updated successfully");
      setPinForm({ oldPin: "", newPin: "", confirmPin: "" });
    } catch (err) {
      setPinError(err.response?.data?.message || "Failed to update PIN");
    }
  };

  if (!admin) return <p>Loading...</p>;

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a className="navbar-brand fw-bold" href="#">
          <FaUserShield className="me-2" />
          Admin Profile
        </a>
        <div className="ms-auto">
          <Link to="/admin/dashboard" className="btn btn-outline-light btn-sm">
            Dashboard
          </Link>
          <button
            className="btn btn-outline-light btn-sm ms-2"
            onClick={() => {
              localStorage.removeItem("adminToken");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container py-5">
        <div
          className="card shadow-lg p-4 mx-auto"
          style={{ maxWidth: "700px" }}
        >
          <h3 className="fw-bold text-center text-primary mb-4">
            Admin Account Settings
          </h3>


          <form onSubmit={handleUpdate}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  readOnly
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-4">
                Update Username
              </button>
            </div>

            {message && (
              <div className="alert alert-success mt-3">{message}</div>
            )}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>


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
                    className="form-control"
                    name="oldPin"
                    value={pinForm.oldPin}
                    onChange={handlePinChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">New PIN</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPin"
                    value={pinForm.newPin}
                    onChange={handlePinChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Confirm PIN</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPin"
                    value={pinForm.confirmPin}
                    onChange={handlePinChange}
                    required
                  />
                </div>
              </div>

              <div className="text-center mt-4">
                <button type="submit" className="btn btn-outline-primary px-4">
                  Update PIN
                </button>
              </div>
            </form>

            {pinMessage && (
              <div className="alert alert-success mt-3">{pinMessage}</div>
            )}
            {pinError && (
              <div className="alert alert-danger mt-3">{pinError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
