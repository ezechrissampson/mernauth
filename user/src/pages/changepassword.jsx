import React, { useState } from "react";
import { Link } from "react-router-dom";
const Changepassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      setSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setSuccess(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setSuccess(false);
      return;
    }

    console.log("Password change request:", formData);

    setMessage("Your password has been successfully updated!");
    setSuccess(true);
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="vh-100 bg-light">

        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a className="navbar-brand fw-bold" href="#">
          MERN Auth Project
        </a>
        <div className="ms-auto">
           <Link to="/dashboard" className="btn btn-outline-light btn-sm ms-2">
            Dashboard
          </Link>
        </div>
      </nav>


      <div className="card shadow-sm mx-auto mt-5" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h4 className="fw-bold text-primary mb-4 text-center">
            Change Password
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Old Password</label>
              <input
                type="password"
                className="form-control"
                name="oldPassword"
                placeholder="Enter your old password"
                value={formData.oldPassword}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">New Password</label>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Update Password
            </button>

            {message && (
              <div
                className={`alert mt-3 ${
                  success ? "alert-success" : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Changepassword;
