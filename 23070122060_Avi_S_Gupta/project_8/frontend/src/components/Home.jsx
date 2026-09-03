import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1 className="header-title">Welcome to MicroApp</h1>
      <div className="dashboard-grid">
        <Link to="/users" style={{textDecoration: 'none', color: 'inherit'}}>
          <div className="glass glass-card">
            <h2>User Management</h2>
            <p style={{color: 'var(--text-muted)', marginTop: '8px'}}>Register and view users.</p>
          </div>
        </Link>
        <Link to="/products" style={{textDecoration: 'none', color: 'inherit'}}>
          <div className="glass glass-card">
            <h2>Product Catalog</h2>
            <p style={{color: 'var(--text-muted)', marginTop: '8px'}}>Manage store products.</p>
          </div>
        </Link>
        <Link to="/orders" style={{textDecoration: 'none', color: 'inherit'}}>
          <div className="glass glass-card">
            <h2>Order Processing</h2>
            <p style={{color: 'var(--text-muted)', marginTop: '8px'}}>Create and view orders.</p>
          </div>
        </Link>
        <Link to="/notifications" style={{textDecoration: 'none', color: 'inherit'}}>
          <div className="glass glass-card">
            <h2>Notifications</h2>
            <p style={{color: 'var(--text-muted)', marginTop: '8px'}}>View system alerts.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
