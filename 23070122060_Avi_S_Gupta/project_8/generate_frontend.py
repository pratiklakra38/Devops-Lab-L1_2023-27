import os

base_dir = "./frontend"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content.strip() + "\n")

files = {
    "package.json": """
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.0"
  }
}
    """,
    "vite.config.js": """
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,
    host: '0.0.0.0'
  }
})
    """,
    "index.html": """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Microservices Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
    """,
    "Dockerfile": """
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
    """,
    "src/main.jsx": """
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
    """,
    "src/index.css": """
:root {
  --primary: #4F46E5;
  --primary-hover: #4338CA;
  --bg-gradient: linear-gradient(135deg, #1e1e2f 0%, #151522 100%);
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --text-main: #f3f4f6;
  --text-muted: #9ca3af;
  --accent: #10B981;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Outfit', sans-serif;
  background: var(--bg-gradient);
  color: var(--text-main);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Glassmorphism Classes */
.glass {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.glass-card {
  padding: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(79, 70, 229, 0.2);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  position: sticky;
  top: 0;
  z-index: 100;
  border-radius: 0 0 16px 16px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: var(--text-main);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.nav-links a:hover, .nav-links a.active {
  background: var(--primary);
  color: white;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  background: -webkit-linear-gradient(#fff, #9ca3af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.container {
  padding: 40px 5%;
  max-width: 1200px;
  margin: 0 auto;
}

.header-title {
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

/* Form Styles */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.form-group input, .form-group select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  background: rgba(0,0,0,0.2);
  color: white;
  font-family: 'Outfit', sans-serif;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
}

.btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  transition: background 0.3s, transform 0.2s;
  width: 100%;
}

.btn:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

/* Lists */
.data-list {
  list-style: none;
  margin-top: 24px;
}

.data-item {
  padding: 16px;
  margin-bottom: 12px;
  background: rgba(255,255,255,0.02);
  border-left: 4px solid var(--primary);
  border-radius: 4px 8px 8px 4px;
  display: flex;
  justify-content: space-between;
}

.data-item h4 {
  margin-bottom: 4px;
}

.data-item p {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.badge {
  background: var(--accent);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}
    """,
    "src/App.jsx": """
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Users from './components/Users';
import Products from './components/Products';
import Orders from './components/Orders';
import Notifications from './components/Notifications';

function App() {
  return (
    <Router>
      <nav className="navbar glass">
        <div className="logo">MicroApp</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/users">Users</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/notifications">Alerts</Link>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
    """,
    "src/components/Home.jsx": """
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
    """,
    "src/components/Users.jsx": """
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
    """,
    "src/components/Products.jsx": """
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/products`, formData);
      setFormData({ name: '', description: '', price: '', stock: '' });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="header-title">Product Catalog</h1>
      <div className="dashboard-grid">
        <div className="glass glass-card">
          <h2>Add Product</h2>
          <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
            </div>
            <button type="submit" className="btn">Add Product</button>
          </form>
        </div>
        <div className="glass glass-card">
          <h2>Available Products</h2>
          <ul className="data-list">
            {products.map((p, i) => (
              <li key={i} className="data-item">
                <div>
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h4 style={{color: 'var(--accent)'}}>${p.price}</h4>
                  <p>Stock: {p.stock}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Products;
    """,
    "src/components/Orders.jsx": """
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ userId: '', productId: '', quantity: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/orders`, formData);
      setFormData({ userId: '', productId: '', quantity: '' });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="header-title">Order Processing</h1>
      <div className="dashboard-grid">
        <div className="glass glass-card">
          <h2>Create Order</h2>
          <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
            <div className="form-group">
              <label>User ID</label>
              <input type="text" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Product ID</label>
              <input type="text" value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
            </div>
            <button type="submit" className="btn">Place Order</button>
          </form>
        </div>
        <div className="glass glass-card">
          <h2>Order History</h2>
          <ul className="data-list">
            {orders.map((o, i) => (
              <li key={i} className="data-item">
                <div>
                  <h4>Order {o.id?.substring(0,8)}</h4>
                  <p>User: {o.userId} | Product: {o.productId}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <span className="badge">{o.status}</span>
                  <p style={{marginTop: '4px'}}>Qty: {o.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Orders;
    """,
    "src/components/Notifications.jsx": """
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
    """
}

for fname, content in files.items():
    write_file(os.path.join(base_dir, fname), content)

print("Frontend React app generated successfully.")
