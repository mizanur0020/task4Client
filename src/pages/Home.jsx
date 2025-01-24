import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [users, setUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");
  const currentUser = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/users"
        );
        setUsers(response.data);

        const user = response.data.find((user) => user.email === currentUser);
        if (user) {
          setCurrentUserName(user.name);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSelectAll = () => {
    const updatedSelectAll = !selectAll;
    setSelectAll(updatedSelectAll);
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({ ...user, selected: updatedSelectAll }))
    );
  };

  const handleUserCheckboxChange = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, selected: !user.selected } : user
      )
    );
    setSelectAll(false);
  };

const handleAction = async (endpoint, statusUpdate = null) => {
  const selectedUsers = users.filter((user) => user.selected);
  const userIds = selectedUsers.map((user) => user.id);
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/users/${endpoint}`, {
      userIds,
    });
    selectedUsers.forEach((user) => {
      if (user.email === currentUser) {
        console.log(`Current user (${currentUser}) is being ${endpoint}`);
        localStorage.removeItem("userEmail");
        window.location.href = "/login";
      }
    });
    if (statusUpdate) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          userIds.includes(user.id) ? { ...user, status: statusUpdate } : user
        )
      );
    } else {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !userIds.includes(user.id))
      );
    }

  } catch (error) {
    console.error(`Error with ${endpoint} action:`, error);
  }
};
  const handleLogout = () => {
    localStorage.removeItem("userEmail");

    window.location.href = "/login";
  };
  useEffect(function () {
    document.title = "Dashboard";
  }, []);

  return (
    <div className="container-fluid p-0">
      <header className="bg-dark text-white py-2 px-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              <h5 className="mb-0">User Management</h5>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <span className="me-3">
                Welcome,{" "}
                <strong className="text-danger">{currentUserName}</strong>
              </span>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <button
              className="btn btn-warning me-2"
              onClick={() => handleAction("block", "Blocked")}
              disabled={!users.some((user) => user.selected)}
            >
              Block
            </button>
            <button
              className="btn btn-success me-2"
              onClick={() => handleAction("unblock", "Active")}
              disabled={!users.some((user) => user.selected)}
            >
              <i className="bi bi-unlock"></i>
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleAction("delete")}
              disabled={!users.some((user) => user.selected)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <table className="table table-striped table-bordered">
          <thead className="bg-light">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={user.selected || false}
                    onChange={() => handleUserCheckboxChange(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "Active" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : "Never"}
                </td>
                <td>
                  {user.created
                    ? new Date(user.created).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
