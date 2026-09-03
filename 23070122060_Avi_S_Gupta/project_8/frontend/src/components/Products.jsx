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
