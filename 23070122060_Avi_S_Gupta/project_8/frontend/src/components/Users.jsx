import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Get API URL from env or fallback to ingress path
const API_URL = import.meta.env.VITE_API_URL || '/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '', name: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users`, formData);
      setFormData({ username: '', email: '', name: '' });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="header-title">User Management</h1>
      <div className="dashboard-grid">
        <div className="glass glass-card">
          <h2>Add New User</h2>
          <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <button type="submit" className="btn">Create User</button>
          </form>
        </div>
        <div className="glass glass-card">
          <h2>Registered Users</h2>
          <ul className="data-list">
            {users.map((u, i) => (
              <li key={i} className="data-item">
                <div>
                  <h4>{u.name}</h4>
                  <p>@{u.username} | {u.email}</p>
                </div>
                <div><span className="badge">ID: {u.id?.substring(0, 5)}</span></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Users;
