import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Verifyemail = () => {
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Missing email in URL. Please sign up again.");
      return;
    }

    if (otp.length < 4) {
      setError("Please enter the full verification code.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-email",
        {
          email,
          code: otp,
        }
      );

      setMessage(res.data?.message || "Email verified successfully!");
      setVerified(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Missing email in URL. Please sign up again.");
      return;
    }

    try {
      setResendLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/resend-code",
        { email }
      );

      setMessage(res.data?.message || "New code sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 text-center" style={{ width: "400px" }}>
        {!verified ? (
          <>
            <h3 className="text-primary fw-bold mb-3">Verify Your Email</h3>
            <p className="text-muted mb-2">
              We sent a verification code to:
            </p>
            <p className="fw-semibold mb-4">{email || "your email"}</p>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control text-center fs-5"
                  placeholder="Enter verification code"
                  maxLength={5}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <p className="text-muted mt-3 mb-0">
              Didn’t receive a code?{" "}
              <button
                className="btn btn-link p-0 ms-1 fw-semibold"
                style={{ textDecoration: "none" }}
                onClick={handleResend}
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend Code"}
              </button>
            </p>
          </>
        ) : (
          <>
            <div className="text-success mb-3">
              <i className="bi bi-check-circle-fill fs-1"></i>
            </div>
            <h3 className="fw-bold text-success mb-2">Email Verified!</h3>
            <p className="text-muted mb-4">
              Your email has been successfully verified. You can now log in to your account.
            </p>
            <button
              className="btn btn-success w-100"
              onClick={() => navigate("/login")}
            >
              Continue to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Verifyemail;
