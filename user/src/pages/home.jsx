import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-5 rounded shadow-lg bg-white" style={{ maxWidth: "600px" }}>
        <h1 className="fw-bold mb-3 text-primary">MERN Authentication Project</h1>
        <p className="lead text-secondary">
          A simple project built with <strong>MongoDB</strong>, <strong>Express</strong>, <strong>React</strong>, and <strong>Node.js</strong>.
        </p>
        <hr />
        <p className="text-muted mb-4">
          This demo includes secure <strong>User Authentication</strong> and an <strong>Admin Dashboard</strong> for managing registered users.
        </p>
        <div>
          <Link to="/login" className="btn btn-primary mx-2">
            User Login
          </Link>
          <Link to="/signup" className="btn btn-outline-primary mx-2">
            Register
          </Link>
          <a href=" http://localhost:5174/admin/" className="btn btn-dark mx-2">
            Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
