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
