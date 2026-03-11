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
    // Static deploy fallback (no backend API): allow demo credentials locally.
    const maybeDemoLogin = () => {
      if (username === 'admin' && password === 'password123') {
        localStorage.setItem('token', DEMO_TOKEN);
        setToken(DEMO_TOKEN);
        setUser(DEMO_USER);
        return { token: DEMO_TOKEN, user: DEMO_USER };
      }
      throw new Error('Invalid username or password');
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        let data = {};
        try { data = await res.json(); } catch (_) {}
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      if (err?.message?.includes('expected pattern') || err instanceof TypeError) {
        return maybeDemoLogin();
      }
      throw err;
    }
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
