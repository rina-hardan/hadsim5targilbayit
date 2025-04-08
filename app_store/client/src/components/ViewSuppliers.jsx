import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import sendRequest from '../api/request';
import SupplierCard from './SupplierCard.jsx';
import '../css/ViewSuppliers.css';

export default function ViewSuppliers() {
  const { adminId } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await sendRequest({
          method: 'GET',
          url: '/suppliers/AllSuppliers',
        });
        setSuppliers(data);
      } catch (error) {
        setMessage(error);
      }
    };

    fetchSuppliers();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button onClick={() => navigate('/admin/homePage')}>🏠 חזרה לדף הבית</button>
      <h1>All Suppliers</h1>
      <h2>Admin ID: {adminId}</h2>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <div className="suppliers-container">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
}
