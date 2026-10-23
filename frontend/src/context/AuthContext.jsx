import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest('/api/auth/me')
      .then(({ user }) => {
        if (active) setCurrentUser(user);
      })
      .catch((error) => {
        if (error.status !== 401) console.error('Could not restore the login session:', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = async (email, password, role = 'user') => {
    try {
      const { user } = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (email, password, fullName) => {
    try {
      const { user } = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
      });
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const result = await apiRequest('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentUser(null);
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const createManagedUser = async (account) => {
    try {
      const result = await apiRequest('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(account),
      });
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      login,
      signup,
      logout,
      changePassword,
      createManagedUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
