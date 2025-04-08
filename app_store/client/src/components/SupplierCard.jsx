import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sendRequest from '../api/request';
import '../css/SupplierCard.css'; 

const SupplierCard = ({ supplier }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sendRequest({
          method: 'GET',
          url: `/products/${supplier.id}`,
        });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [supplier.id]);

  const handleCreateOrder = () => {
    navigate(`/admin/createOrder`, {
      state: { supplier, products }
    });
  };

  return (
    <div className="supplier-card">
      <h3>{supplier.company_name}</h3>
      <p><strong>Contact:</strong> {supplier.supplier_name}</p>
      <p><strong>Email:</strong> {supplier.email}</p>
      <p><strong>Phone:</strong> {supplier.phone_number}</p>

      {products.length > 0 ? (
        <div className="product-select-container">
          <label htmlFor={`product-select-${supplier.id}`}>Products for sale: 🛍️</label><br />
          <select
            id={`product-select-${supplier.id}`}
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">View products</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.product_name} - ₪{product.price_per_unit}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="no-products-message">This supplier has no products.</p>
      )}

      <button className="create-order-button" onClick={handleCreateOrder}>
        Create Order
      </button>
    </div>
  );
};

export default SupplierCard;
