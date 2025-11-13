import React, { useState } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
       await axios.post("http://localhost:5000/api/auth/signup", formData);
      setMessage("Signup successful! You can now login.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleAuth = () => {
    console.log("Google Auth Clicked");
    // TODO: Integrate Google OAuth here
  };

  const handleAppleAuth = () => {
    console.log("Apple Auth Clicked");
    // TODO: Integrate Apple OAuth here
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-3 text-primary fw-bold">Create Account</h2>
        <p className="text-center text-muted mb-4">
          Sign up to access your dashboard and manage your account
        </p>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>

        <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                onChange={handleChange}
                required
              />
           </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Sign Up
          </button>

          <div className="text-center text-muted my-2">or continue with</div>

          <div className="d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-outline-danger me-2"
              onClick={handleGoogleAuth}
            >
              <FaGoogle className="me-2" /> Google
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={handleAppleAuth}
            >
              <FaApple className="me-2" /> Apple
            </button>
          </div>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none fw-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
