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
