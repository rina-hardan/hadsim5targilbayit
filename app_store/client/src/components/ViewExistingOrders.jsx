import React, { useEffect, useState } from 'react';
import sendRequest from '../api/request.js';
import '../css/ViewExistingOrders.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
const ViewExistingOrders = () => {
  const adminId = useAuth();
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchExistingOrders = async () => {
      try {
        const data = await sendRequest({
          method: 'GET',
          url: `/orders/existingOrders/${adminId.adminId}`,
        });
        setOrders(data);
      } catch (error) {
        setErrorMessage(error);
      }
    };

    if (adminId) {
      fetchExistingOrders();
    }
  }, [adminId]);

  const handleApprove = async (orderId) => {
    try {
      await sendRequest({
        method: 'PATCH',
        url: `/orders/${orderId}/confirm`,
        body:{},
      });

      setSuccessMessage(`ההזמנה ${orderId} סומנה כהושלמה.`);
      
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.order_id !== orderId)
      
      );
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      setErrorMessage(`שגיאה בעדכון ההזמנה ${orderId}`);
    }
  };

  return (
    <div className="view-orders-container">
      <button onClick={() => navigate('/admin/homePage')}>🏠 חזרה לדף הבית</button>
      <h2>📦 הזמנות קיימות</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {orders.length === 0 ? (
        <p className="no-orders">אין הזמנות במצב ממתין או בתהליך.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>תאריך</th>
              <th>סטטוס</th>
              <th>ספק</th>
              <th>טלפון</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>{order.supplier_company_name}</td>
                <td>{order.supplier_phone}</td>
                <td>
                  <button onClick={() => handleApprove(order.order_id)}>
                    הושלם
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewExistingOrders;
