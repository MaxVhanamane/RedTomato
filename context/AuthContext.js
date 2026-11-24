import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export const AuthContext = createContext({
  token: null,
  user: null,
  role: null,
  removeToken: () => {},
  setAuthData: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role');
      if (storedToken === 'undefined') {
        localStorage.removeItem('token');
      }
      const validToken = (storedToken && storedToken !== 'undefined') ? storedToken : (storedUser || null);
      if (validToken) setToken(validToken);
      if (storedUser) setUser(storedUser);
      if (storedRole) setRole(storedRole);
    } catch (e) {
      // localStorage may fail in restricted/private modes
    }
  }, []);

  // Keep state in sync with router navigation
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role');
      const validToken = (storedToken && storedToken !== 'undefined') ? storedToken : (storedUser || null);
      setToken(validToken);
      setUser(storedUser || null);
      setRole(storedRole || null);
    } catch (e) {
      // ignore
    }
  }, [router.asPath]);

  const setAuthData = useCallback((newToken, newUser, newRole) => {
    setToken(newToken);
    setUser(newUser);
    setRole(newRole);
    try {
      if (newToken) localStorage.setItem('token', newToken);
      else localStorage.removeItem('token');

      if (newUser) localStorage.setItem('user', newUser);
      else localStorage.removeItem('user');

      if (newRole) localStorage.setItem('role', newRole);
      else localStorage.removeItem('role');
    } catch (e) {
      // ignore
    }
  }, []);

  const removeToken = useCallback(async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    } catch (e) {
      // ignore
    }
    setToken(null);
    setUser(null);
    setRole(null);
    router.push('/');
    toast.success('Logged out successfully!', {
      position: 'top-left',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, [router]);

  return (
    <AuthContext.Provider value={{ token, user, role, removeToken, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
