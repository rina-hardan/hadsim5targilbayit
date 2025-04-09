import React, { useState } from 'react';
import sendRequest from '../api/request.js';
import '../css/AddSupplier.css';
import { useNavigate } from 'react-router-dom';
const AddSupplier = () => {
  const [supplier, setSupplier] = useState({
    company_name: '',
    supplier_name: '',
    phone_number: '',
    email: '',
    password: '',
  });

  const [products, setProducts] = useState([
    { product_name: '', price_per_unit: '', min_quantity: '' },
  ]);

  const handleSupplierChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, e) => {
    const newProducts = [...products];
    newProducts[index][e.target.name] = e.target.value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { product_name: '', price_per_unit: '', min_quantity: '' }]);
  };

  const removeProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
        const validProducts = products.filter(p => 
            p.product_name && 
            !isNaN(parseFloat(p.price_per_unit)) && 
            !isNaN(parseInt(p.min_quantity))
          );

          const data=  await sendRequest({
            method: 'POST',
            url: '/suppliers/register',
            body: {
              ...supplier,
              products: validProducts.map((p) => ({
                ...p,
                price_per_unit: parseFloat(p.price_per_unit),
                min_quantity: parseInt(p.min_quantity),
              }))
            }
          });                   
      alert('הספק נרשם בהצלחה!');
       localStorage.setItem('supplierId', data.supplierId);
      navigate('/suppliers/homePage');
    } catch (error) {
      alert('שגיאה בהרשמה: ' + error.message);
    }
  };

  return (
    <div className="add-supplier-container">
    <div className="form-container">
      <h2>📋 רישום ספק חדש</h2>
      <form onSubmit={handleSubmit}>
        <input name="company_name" placeholder="שם חברה" onChange={handleSupplierChange} required />
        <input name="supplier_name" placeholder="שם נציג" onChange={handleSupplierChange} required />
        <input name="phone_number" placeholder="טלפון" onChange={handleSupplierChange} required />
        <input name="email" type="email" placeholder="אימייל" onChange={handleSupplierChange} required />
        <input name="password" type="password" placeholder="סיסמה" onChange={handleSupplierChange} required />
  
        <h3>🛒 מוצרים</h3>
        {products.map((product, index) => (
          <div className="product-input" key={index}>
            <input
              name="product_name"
              placeholder="שם מוצר"
              value={product.product_name}
              onChange={(e) => handleProductChange(index, e)}
              required
            />
            <input
              name="price_per_unit"
              placeholder="מחיר ליחידה"
              value={product.price_per_unit}
              onChange={(e) => handleProductChange(index, e)}
              required
            />
            <input
              name="min_quantity"
              placeholder="כמות מינימלית"
              type="number"
              value={product.min_quantity}
              onChange={(e) => handleProductChange(index, e)}
              required
            />
            <button type="button" onClick={() => removeProduct(index)}>🗑️</button>
          </div>
        ))}
        <button type="button" onClick={addProduct}>➕ הוסף מוצר</button>
        <button type="submit">📨 הרשם</button>
      </form>
    </div>
  </div>
)  
};

export default AddSupplier;
