import React, { useEffect, useState } from 'react';
import sendRequest from '../api/request.js';
import OrderCard from '../components/OrderCard.jsx';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { adminId } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await sendRequest({
          method: 'GET',
          url: `/orders/${adminId}`
        });
        setOrders(data);
      } catch (error) {
        setErrorMessage(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ textAlign: 'center', paddingTop: '30px' }}>
      <button onClick={() => navigate('/admin/homePage')}>🏠 חזרה לדף הבית</button>
      <h1>📑 כל ההזמנות</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {orders.length === 0 ? (
        <p>אין הזמנות להצגה כרגע.</p>
      ) : (
        orders.map(order => (
          <OrderCard key={order.order_id} order={order} />
        ))
      )}
    </div>
  );
};

export default ViewOrders;
