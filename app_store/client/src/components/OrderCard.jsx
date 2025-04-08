import React from 'react';
import '../css/OrderCard.css';

const OrderCard = ({ order }) => {
  console.log(order);
  return (
    <div className="order-card">
      <h3>הזמנה #{order.order_id}</h3>
      <p><strong>ספק:</strong> {order.supplier_id}</p>
      <p><strong>סטטוס:</strong> {order.status}</p>
      <p><strong>תאריך:</strong> {new Date(order.order_date).toLocaleDateString()}</p>

      <h4 style={{ marginTop: '20px' }}>📦 רשימת מוצרים:</h4>
      {order.products && order.products.length > 0 ? (
        <table className="products-table">
          <thead>
            <tr>
              <th>מזהה מוצר</th>
              <th>שם מוצר</th>
              <th>כמות</th>
              <th>מחיר ליחידה (₪)</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, index) => (
              <tr key={index}>
                <td>{product.product_id}</td>
                <td>{product.product_name}</td>
                <td>{product.quantity}</td>
                <td>{product.price_per_unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>לא נמצאו מוצרים להזמנה זו.</p>
      )}
    </div>
  );
};

export default OrderCard;
