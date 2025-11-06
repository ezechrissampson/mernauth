import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Usertable = ({ users }) => {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h5 className="card-title text-primary fw-bold mb-3">
          Registered Users
        </h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Date Joined</th>
                <th>Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.dateJoined}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "Admin"
                            ? "bg-danger"
                            : "bg-success"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-2">
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">
                    No registered users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Usertable;
