import React, { useEffect, useState } from 'react';
import sendRequest from '../api/request.js';
import OrderCard from '../components/OrderCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const SupplierOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const supplierId = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await sendRequest({
          method: 'GET',
          url: `/orders/supplier_id/${supplierId.supplierId}`,
        });
        setOrders(res);
      } catch (error) {
        console.error('Error fetching supplier orders:', error);
      }
    };

    fetchOrders();
  }, [supplierId]);

  return (
    <div>
      <h3>📄 All Orders</h3>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => <OrderCard key={order.order_id} order={order} />)
      )}
    </div>
  );
};

export default SupplierOrdersList;
