import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"

const Usertable = () => {

const [Users, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ name: "", username: "", email: "" });


useEffect(() => {
    fetchUsers();
  }, []);


const fetchUsers = () => {
  axios.get("http://localhost:5000/api/users")
  .then(res => setUser(res.data))
  .catch(err => console.error(err))
};


function deleteUser(id) {
  try{
      if (!confirm("Are you sure you want to delete this user?")) return;
     axios.delete(`http://localhost:5000/api/users/${id}`)
    fetchUsers();
    alert("User deleted successfully!");
  }
catch (err) {
      console.error(err);
      alert("Update failed");
    }
}


  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    try {
      await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, updatedUser);
      fetchUsers();
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

const openEditModal = (user) => {
    setSelectedUser(user);
    setUpdatedUser({
      name: user.name,
      username: user.username,
      email: user.email,
    });
  };




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
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>

              {Users && Users.length > 0 ? (
                Users.map((user, i) => (
              <tr key={user._id}>
              <td>{i + 1}</td>
              <td>
       {user.profilePic ? (
        <img
        src={
        user.profilePic?.startsWith("http")
        ? user.profilePic
        : `http://localhost:5000/${user.profilePic}`
        }
                 
        alt="Profile"
        className="rounded-circle mb-3"
        style={{ width: "30px", height: "30px", objectFit: "cover", marginTop:"10px", marginRight:"5px" }}
        />
        ) : (
        <FaUserCircle className="text-primary mb-3" size={10} />
        )}
      {user.name}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      < td>{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#editModal"
                      onClick={() => openEditModal(user)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(user._id)}>
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

  <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update User
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedUser ? (
                <>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={updatedUser.name}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={updatedUser.username}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={updatedUser.email}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                  />
                </>
              ) : (
                <p>Loading user...</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                Save changes
              </button>
            </div>
          </div>
        </div>
  </div>


        </div>
      </div>
    </div>
  );
};

export default Usertable;
