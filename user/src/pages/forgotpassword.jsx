import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setMessage(res.data.message || "If that email exists, a reset link has been sent.");
      setSubmitted(true);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Something went wrong, please try again."
      );
      setSubmitted(true);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 text-center" style={{ width: "400px" }}>
        {!submitted ? (
          <>
            <h3 className="text-primary fw-bold mb-3">Forgot Password</h3>
            <p className="text-muted mb-4">
              Enter your registered email address, and we’ll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Send Reset Link
              </button>
            </form>

            <p className="mt-4 text-muted">
              Remember your password?{" "}
              <Link to="/login" className="text-decoration-none fw-semibold">
                Back to Login
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="text-success mb-3">
              <i className="bi bi-envelope-check fs-1"></i>
            </div>
            <h4 className="fw-bold text-success mb-2">Check Your Email</h4>
            {message && <p className="text-muted mb-2">{message}</p>}
            <p className="text-muted mb-4">
              We’ve sent a password reset link to <strong>{email}</strong> (if it exists).
            </p>
            <Link to="/login" className="btn btn-success w-100">
              Return to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Forgotpassword;
