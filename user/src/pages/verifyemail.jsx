import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Verifyemail = () => {
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered OTP:", otp);

    
    setVerified(true);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 text-center" style={{ width: "400px" }}>
        {!verified ? (
          <>
            <h3 className="text-primary fw-bold mb-3">Verify Your Email</h3>
            <p className="text-muted mb-4">
              Enter the 6-digit code sent to your email address to verify your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control text-center fs-5"
                  placeholder="Enter OTP Code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Verify Email
              </button>
            </form>

            <p className="text-muted mt-3">
              Didn’t receive a code?{" "}
              <a href="#" className="text-decoration-none fw-semibold">
                Resend OTP
              </a>
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
            <a href="/login" className="btn btn-success w-100">
              Continue to Login
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Verifyemail;
