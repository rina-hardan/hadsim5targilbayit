import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sendRequest from '../api/request';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const data = await sendRequest({
        method: 'POST',
        url: '/admin/register',
        body: {
          username: form.fullName,
          email: form.email,
          password: form.password,
        },
      });

      localStorage.setItem('adminId', data.adminId);
      setMessage(data.message || 'Your registration was successful.');
      navigate('/admin/homePage');

    } catch (errMessage) {
      setMessage(errMessage);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Admin registration</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="fullName"
          placeholder="fullName"
          value={form.fullName}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="email"
          name="email"
          placeholder="email"
          value={form.email}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={form.password}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">signUp</button>
      </form>

      {message && <p style={{ marginTop: '20px', color: 'red' }}>{message}</p>}
    </div>
  );
};

export default AdminRegister;
