import React from 'react';
import { useNavigate } from 'react-router-dom';
import  { useEffect } from 'react';
import '../css/UserTypeSelector.css'; 
useEffect(() => {
  localStorage.clear();
  window.history.replaceState(null, "", window.location.href);
  }, []);

const UserTypeSelector = () => {
  const navigate = useNavigate();

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
