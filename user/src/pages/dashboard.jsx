import React, { useEffect, useState } from "react";
import { FaCode, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/profile", {
        withCredentials: true, // ✅ send cookie to backend
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        // if unauthorized, kick back to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true, // ✅ send cookie so backend can clear it
        }
      );
    } catch (err) {
      console.error("Logout error", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("token"); // still clear local token if present
      window.location.href = "/login";
    }
  };

  return (
    <div className="vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a className="navbar-brand fw-bold" href="#">
          MERN Auth Dashboard
        </a>
        <div className="ms-auto">
          <Link to="/profile" className="btn btn-outline-light btn-sm me-2">
            <FaUser className="me-1" /> Profile
          </Link>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mt-5 text-center">
        <h2 className="fw-bold text-primary">
          {user ? `Welcome ${user.username}` : "Loading..."}
        </h2>
        <p className="text-muted mb-4">
          Build, manage, and explore — this project showcases a full MERN stack
          authentication and admin management system.
        </p>

        <div
          className="card shadow-sm p-4 mx-auto"
          style={{ maxWidth: "650px" }}
        >
          <div className="card-body">
            <FaCode className="text-primary fs-1 mb-3" />
            <h4 className="fw-bold mb-2">Project Overview</h4>
            <p className="text-muted">
              This project is built using the <strong>MERN Stack</strong> — 
              MongoDB, Express, React, and Node.js. It features user 
              authentication, admin management, and profile customization.  
              Frontend uses <strong>React + Bootstrap</strong> for a smooth, modern UI, 
              and backend supports secure JWT authentication with REST APIs.
            </p>

            <div className="alert alert-info mt-3">
              Go to your{" "}
              <Link to="/profile" className="fw-bold text-decoration-none">
                Profile
              </Link>{" "}
              tab to update your details, change your password, or personalize your interface.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
