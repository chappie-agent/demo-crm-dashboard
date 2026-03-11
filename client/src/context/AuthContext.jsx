import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const DEMO_USER = { id: 1, username: 'admin', name: 'Admin User' };
const DEMO_TOKEN = 'demo-token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (!token) return;

    if (token === DEMO_TOKEN) {
      setUser(DEMO_USER);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      });
  }, [token]);

  const login = async (username, password) => {
    // Static deploy fallback (no backend API): accept demo credentials immediately.
    if (username === 'admin' && password === 'password123') {
      localStorage.setItem('token', DEMO_TOKEN);
      setToken(DEMO_TOKEN);
      setUser(DEMO_USER);
      return { token: DEMO_TOKEN, user: DEMO_USER };
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
