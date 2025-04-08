import React, { useState } from 'react';
import SupplierOrdersList from '../components/SupplierOrdersList.jsx';
import PendingOrdersList from '../components/PendingOrdersList.jsx';
import '../css/SupplierHomePage.css';
import { useNavigate } from 'react-router-dom';
const SupplierOrdersPage = () => {
  const [view, setView] = useState('');
  const navigate = useNavigate();
  return (
    <div className="supplier-orders-container">
      <button onClick={() => navigate('/')}>logOut</button>
      <h2>📦 Supplier Orders Dashboard</h2>
      <div className="supplier-buttons">
        <button onClick={() => setView('all')}>View All Orders</button>
        <button onClick={() => setView('pending')}>View Pending Orders</button>
      </div>

      {view === 'all' && <SupplierOrdersList />}
      {view === 'pending' && <PendingOrdersList />}
    </div>
  );
};

export default SupplierOrdersPage;
