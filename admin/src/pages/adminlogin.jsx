import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import axios from "axios"

const Adminlogin = () => {
  const [formData, setForm] = useState({ emailOrUsername: "", pin: "" });
  const [error, seterror] = useState("");

  const handleChange = (e) => {
    setForm({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", formData);
      localStorage.setItem("token", res.data.token);
      seterror("Login successful!");
      window.location.href = "/dashbaord";
    } catch (err) {
      seterror(err.response?.data?.message || "Login failed");
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
            <label className="form-label fw-semibold">Username or Email</label>
            <input
              type="text"
              className="form-control"
              name="emailOrUsername"
              placeholder="Enter admin username or Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold"> PIN</label>
            <input
              type="password"
              className="form-control"
              name="pin"
              placeholder="Enter admin PIN"
              onChange={handleChange}
              required
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
