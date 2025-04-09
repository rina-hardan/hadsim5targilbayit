import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/UserTypeSelector.css'; 

const UserTypeSelector = () => {
  const navigate = useNavigate();
  localStorage.clear();
  const handleSelectUserType = (type) => {
    navigate(`/login/${type === 'admin' ? 'admin' : 'supplier'}`);
  };

  return (
    <div className="selector-container">
      <h2 className="selector-title">בחרי סוג משתמש</h2>
      <div className="button-group">
        <button className="user-button" onClick={() => handleSelectUserType('admin')}>
          Admin
        </button>
        <button className="user-button" onClick={() => handleSelectUserType('supplier')}>
          Supplier
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelector;
