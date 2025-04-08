import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminHomePage.css'; 

const AdminHomePage = () => {
  const navigate = useNavigate();

  
  return (
    <div className="admin-home-container">
      <button onClick={() => navigate('/')}>logOut</button>
      <h2> 🛒!ברוך הבא, בעל מכולת</h2>
      <div className="admin-buttons">
        <button onClick={() => navigate(`/admin/suppliers`)}>
          View Suppliers
        </button>
        <button onClick={() => navigate(`/admin/orders`)}>
          View Orders
        </button>
        <button onClick={() => navigate(`/admin/existing-orders`)}>
          View Existing Orders
        </button>
      </div>
    </div>
  );
};

export default AdminHomePage;
