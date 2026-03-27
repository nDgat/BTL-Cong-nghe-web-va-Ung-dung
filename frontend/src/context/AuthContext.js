import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const getStoredToken = () => localStorage.getItem('token');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      // savedUser có thể bị ghi sai trước đó (ví dụ "undefined"), nên cần guard.
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
      authAPI.getProfile().then(res => {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
      }).catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    // Backend trả về: { message, data: { user, token, refreshToken } }
    const payload = res.data?.data || {};
    const token = payload.token;
    const userData = payload.user;

    if (!token || !userData) {
      throw new Error('Invalid login response from server');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (...roles) => user && roles.includes(user.role);
  const isAuthenticated = Boolean(user || getStoredToken());

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
