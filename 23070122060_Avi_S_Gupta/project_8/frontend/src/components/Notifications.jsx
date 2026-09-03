import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="header-title">System Alerts & Notifications</h1>
      <div className="glass glass-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Recent Notifications</h2>
            <button onClick={fetchNotifications} className="btn" style={{width: 'auto'}}>Refresh</button>
        </div>
        <ul className="data-list">
          {notifications.map((n, i) => (
            <li key={i} className="data-item" style={{borderLeftColor: '#f59e0b'}}>
              <div>
                <h4>{n.message}</h4>
              </div>
              <div>
                <p>{new Date(n.sentAt).toLocaleString()}</p>
              </div>
            </li>
          ))}
          {notifications.length === 0 && <p style={{marginTop: '16px', color: 'var(--text-muted)'}}>No notifications found.</p>}
        </ul>
      </div>
    </div>
  );
}

export default Notifications;
