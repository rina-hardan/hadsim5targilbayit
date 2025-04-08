import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import sendRequest from '../api/request.js';
import { useAuth } from '../context/AuthContext.jsx';
import '../css/Login.css'; 

const Login = () => {
  const { loginAdmin, loginSupplier } = useAuth();
  const { userType } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    const url = userType === 'admin' ? '/admin/login' : '/suppliers/login';

    try {
      const data = await sendRequest({
        method: 'POST',
        url,
        body: form,
      });

      setMessage(data.message || 'Connection successful');
      console.log('Logged in user:', data);

      if (userType === 'admin') {
        loginAdmin(data.admin.id);
        navigate('/admin/homePage');
      } else {
        loginSupplier(data.supplier.id);
        navigate('/suppliers/homePage');
      }

    } catch (errorMessage) {
      setMessage(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{userType === 'admin' ? 'Admin Login' : 'Supplier Login'}</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        {message && <p className="error-message">{message}</p>}

        <p>
          Not registered?{' '}
          <Link to={userType === 'admin' ? '/register/admin' : '/register/supplier'}>
            Click here to register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
