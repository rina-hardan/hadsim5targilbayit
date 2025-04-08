
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import UserTypeSelector from '../src/components/UserTypeSelector.jsx';
import Login from '../src/components/Login.jsx';
import AdminHomePage from '../src/components/AdminHomePage.jsx';
import SupplierHomePage from "../src/components/SupplierHomePage.jsx"
import AdminRegister from "../src/components/AdminRegister.jsx";
import ViewSuppliers from '../src/components/ViewSuppliers';
import ViewOrders from '../src/components/ViewOrders';
import ViewExistingOrders from '../src/components/ViewExistingOrders.jsx';
import CreateOrder from '../src/components/CreateOrder.jsx';
import AddSupplier from './components/AddSupplier.jsx'; 

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UserTypeSelector />} />
      <Route path="/login/:userType" element={<Login />} />
      <Route path="/register/admin" element={<AdminRegister />} />
      <Route path="/register/supplier" element={<AddSupplier />} />
      <Route path="/admin/homePage" element={<AdminHomePage />} />
      <Route path="/suppliers/homePage" element={<SupplierHomePage />} />
      <Route path="/admin/suppliers" element={<ViewSuppliers />} />
      <Route path="/admin/orders" element={<ViewOrders />} />
      <Route path="/admin/existing-orders" element={<ViewExistingOrders />} />
      <Route path="/admin/createOrder" element={<CreateOrder />} />
    </Routes>
  );
};

export default App;


