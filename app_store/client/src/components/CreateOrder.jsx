import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import sendRequest from '../api/request.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../css/CreateOrder.css'; 

const CreateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { adminId } = useAuth();
  const { supplier, products } = location.state;

  const [selectedProducts, setSelectedProducts] = useState(() => {
    const initial = {};
    products.forEach(p => {
      initial[p.id] = { selected: false, quantity: '' };
    });
    return initial;
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const toggleProduct = (productId) => {
    setErrorMessage('');
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        selected: !prev[productId].selected,
        quantity: ''
      }
    }));
  };

  const handleQuantityChange = (productId, value) => {
    setErrorMessage('');
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: value
      }
    }));
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    const orderItems = Object.entries(selectedProducts)
      .filter(([_, value]) => value.selected && value.quantity)
      .map(([productId, value]) => ({
        productId: Number(productId),
        quantity: Number(value.quantity)
      }));

    for (let item of orderItems) {
      const product = products.find(p => p.id === item.productId);
      if (item.quantity < product.min_quantity) {
        setErrorMessage(`המוצר "${product.product_name}" דורש כמות מינימלית של ${product.min_quantity}`);
        return;
      }
    }

    try {
      await sendRequest({
        method: 'POST',
        url: '/orders/createOrder',
        body: {
          supplier_id: Number(supplier.id),
          admin_id: adminId,
          products: orderItems
        }
      });

      setSuccessMessage('ההזמנה נשלחה בהצלחה 🎉');
      navigate('/admin/homePage');
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <div className="create-order-container">
      <button onClick={() => navigate('/admin/homePage')}>🏠 חזרה לדף הבית</button>

      <h2>הזמנה מ: {supplier.company_name}</h2>
      <h3>בחר מוצרים:</h3>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="products-container">
        {products.map(product => {
          const isSelected = selectedProducts[product.id]?.selected;
          return (
            <div key={product.id} className="product-card">
              <p><strong>{product.product_name}</strong></p>
              <p>מחיר ליחידה: ₪{product.price_per_unit}</p>
              <p>כמות מינימלית: {product.min_quantity}</p>
              <button
                onClick={() => toggleProduct(product.id)}
                className="select-button"
                style={{ backgroundColor: isSelected ? '#f44336' : '#4CAF50' }}
              >
                {isSelected ? '❌ ביטול מוצר' : '✅ בחר להזמנה'}
              </button>

              {isSelected && (
                <div>
                  <input
                    type="number"
                    placeholder="כמות להזמנה"
                    value={selectedProducts[product.id].quantity}
                    min={product.min_quantity}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="input-quantity"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={handleSubmit} className="submit-button">
        📦 שלח הזמנה
      </button>
    </div>
  );
};

export default CreateOrder;
