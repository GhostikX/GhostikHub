import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { performLogin } from '../services/session-client';

const Login = ({ setIsAuthenticated, userData }) => {

  const [loginForm, setLoginForm] = useState({ 
    usernameOrEmail: '',
    password: '',
    ip_address: '', 
    location: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData.ip_address && userData.location) {
      setLoginForm((prevForm) => ({
        ...prevForm,
        ip_address: userData.ip_address,
        location: userData.location
      }));
    }
  }, [userData]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    performLogin(loginForm).then(res => {
      setIsAuthenticated(true);
      navigate('/dashboard');
    }).catch(err => {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      setIsAuthenticated(false);
    })
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md bg-settings text-white">
        <h2 className="mb-6 text-2xl font-semibold text-center">Login</h2>
        {error && <div className="mb-4 text-red-600 text-opacity-90">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-lg text-white">Username</label>
            <input
              type="text"
              id="username"
              maxLength={60}
              value={loginForm.usernameOrEmail}
              onChange={(e) => setLoginForm({...loginForm, usernameOrEmail: e.target.value})}
              className={`
                w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                ${error ? 'border-red-600 border-opacity-40' : ''}
                `}
              autoComplete='username'
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-lg text-white">Password</label>
            <input
              type="password"
              id="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className={`
                w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                ${error ? 'border-red-600 border-opacity-40' : ''}
                `}
              autoComplete='current-password'
            />
          </div>
          <button type="submit" className="w-full text-lg px-4 py-2 bg-gray-700 bg-opacity-40 text-gray-200 rounded-md transition duration-500 hover:bg-gray-600 focus:outline-none">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
