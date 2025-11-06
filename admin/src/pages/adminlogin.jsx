import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Adminlogin = () => {
  const [formData, setFormData] = useState({ username: "", pin: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, pin } = formData;

    if (!username || !pin) {
      setError("Please fill in all fields.");
      return;
    }

    if (pin.length !== 4) {
      setError("PIN must be 4 digits.");
      return;
    }

    // ✅ Example check (replace with backend API validation later)
    if (username === "admin" && pin === "1234") {
      console.log("Admin authenticated!");
      setError("");
      // Redirect to dashboard
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or PIN.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <div className="text-center mb-3">
          <FaLock className="text-primary fs-1 mb-2" />
          <h3 className="fw-bold text-primary">Admin Access</h3>
          <p className="text-muted">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Enter admin username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">4-Digit PIN</label>
            <input
              type="password"
              className="form-control"
              name="pin"
              placeholder="Enter admin PIN"
              value={formData.pin}
              onChange={handleChange}
              maxLength="4"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: "0.9rem" }}>
          Restricted section — for authorized administrators only.
        </p>
      </div>
    </div>
  );
};

export default Adminlogin;
