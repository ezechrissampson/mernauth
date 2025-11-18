import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaApple } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [formData, setForm] = useState({ emailOrUsername: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // 🔹 If backend says user needs verification
      if (res.data.needsVerification) {
        const realEmail = res.data.email;
        const maskedEmail = res.data.maskedEmail;

        // store REAL email for verify-email page
        localStorage.setItem("verifyEmail", realEmail);

        // show masked email in URL for UI
        navigate(
          `/verify-email?email=${encodeURIComponent(maskedEmail)}`
        );
        return;
      }

      // 🔹 Normal successful login
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      navigate("/profile");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    console.log("Google Auth Clicked");
  };

  const handleAppleAuth = () => {
    console.log("Apple Auth Clicked");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-3 text-primary fw-bold">Welcome Back</h2>
        <p className="text-center text-muted mb-4">
          Login to access your account and dashboard
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email or Username</label>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Enter username or email"
              className="form-control"
              value={formData.emailOrUsername}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-end mb-4">
            <Link
              to="/forgot-password"
              className="text-decoration-none text-primary fw-semibold"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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

        <p className="text-center mt-4 mb-0">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-decoration-none fw-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
