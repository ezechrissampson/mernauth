import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Resetpassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    console.log("New password set:", password);
    // TODO: Send PUT/PATCH request to backend (e.g. /api/auth/reset-password/:token)
    setSuccess(true);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 text-center" style={{ width: "400px" }}>
        {!success ? (
          <>
            <h3 className="text-primary fw-bold mb-3">Reset Your Password</h3>
            <p className="text-muted mb-4">
              Enter your new password below to secure your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label fw-semibold">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4 text-start">
                <label className="form-label fw-semibold">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-danger mb-3">{error}</p>}

              <button type="submit" className="btn btn-primary w-100">
                Reset Password
              </button>
            </form>

            <p className="mt-4 text-muted">
              Remember your password?{" "}
              <a href="/login" className="text-decoration-none fw-semibold">
                Back to Login
              </a>
            </p>
          </>
        ) : (
          <>
            <div className="text-success mb-3">
              <i className="bi bi-check-circle-fill fs-1"></i>
            </div>
            <h4 className="fw-bold text-success mb-2">Password Reset Successful</h4>
            <p className="text-muted mb-4">
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <Link to="/login" className="btn btn-success w-100">
              Continue to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Resetpassword;
