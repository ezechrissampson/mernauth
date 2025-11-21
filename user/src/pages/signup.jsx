

import React, { useState } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------- Normal email/password signup ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setMessage(
        res.data?.message ||
          "Signup successful! Please check your email for the verification code."
      );

      // go to verify page with email
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Google signup/login ----------
  const googleLogin = useGoogleLogin({
    flow: "implicit", // using access_token flow
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        setError("");
        setMessage("");

        const accessToken = tokenResponse.access_token;

        const res = await axios.post(
          "http://localhost:5000/api/auth/google",
          { accessToken }
        );

        // store your own JWT from backend
        localStorage.setItem("token", res.data.token);
        setMessage("Signed up / logged in with Google successfully!");
        navigate("/profile");
      } catch (err) {
        console.error("Google auth error:", err);
        setError(
          err.response?.data?.message || "Google authentication failed"
        );
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError("Google authentication was cancelled or failed.");
    },
  });

  const handleAppleAuth = () => {
    console.log("Apple Auth Clicked");
    // implement later
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-3 text-primary fw-bold">
          Create Account
        </h2>
        <p className="text-center text-muted mb-4">
          Sign up to access your dashboard and manage your account
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

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
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-muted my-2">or continue with</div>

        <div className="d-flex justify-content-center">
          {/* Google button with your design */}
          <button
            type="button"
            className="btn btn-outline-danger me-2"
            onClick={() => googleLogin()}
            disabled={googleLoading}
          >
            <FaGoogle className="me-2" />
            {googleLoading ? "Connecting..." : "Google"}
          </button>

          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={handleAppleAuth}
          >
            <FaApple className="me-2" /> Apple
          </button>
        </div>

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
