import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminId, setAdminId] = useState(() => {
    return localStorage.getItem('adminId') || null;
  });

  const [supplierId, setSupplierId] = useState(() => {
    return localStorage.getItem('supplierId') || null;
  });

  const loginAdmin = (id) => {
    setAdminId(id);
    localStorage.setItem('adminId', id);
  };

  const loginSupplier = (id) => {
    setSupplierId(id);
    localStorage.setItem('supplierId', id);
  };

  const logout = () => {
    setAdminId(null);
    setSupplierId(null);
    localStorage.removeItem('adminId');
    localStorage.removeItem('supplierId');
  };

  return (
    <AuthContext.Provider value={{ adminId, supplierId, loginAdmin, loginSupplier, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
