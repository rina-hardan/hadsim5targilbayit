import React, { useEffect, useState } from 'react';
import sendRequest from '../api/request.js';
import '../css/ViewExistingOrders.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
const ViewInProcessOrders = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const supplierId = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchInProcessOrders = async () => {
      try {
        const data = await sendRequest({
          method: 'GET',
          url: `/orders/pending/${supplierId.supplierId}`,
        });
        setOrders(data);
      } catch (error) {
        setErrorMessage('');
      }
    };

    if (supplierId) {
      fetchInProcessOrders();
    }
  }, [supplierId]);

  const handleApprove = async (orderId) => {
    try {
      await sendRequest({
        method: 'PATCH',
        url: `/orders/${orderId}/approve`,
        body: {},
      });
  
      setSuccessMessage(`הזמנה ${orderId} עודכנה ל-"בתהליך".`);

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
  
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.order_id !== orderId)
      );
    } catch (error) {
      setErrorMessage(`שגיאה בעדכון ההזמנה ${orderId}`);

      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };
  return (
    <div className="view-orders-container">
      <h2> הזמנות בתהליך</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {orders.length === 0 ? (
        <p className="no-orders">אין הזמנות בהמתנה.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>תאריך</th>
              <th>סטטוס</th>
              <th>מזהה מנהל</th>
              <th>מספר הזמנה</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>{order.admin_id}</td>
                <td>{order.order_id}</td>
                <td>
                  <button onClick={() => handleApprove(order.order_id)}>
                    בתהליך
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

export default ViewInProcessOrders;
