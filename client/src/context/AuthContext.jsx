import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined); // undefined = loading
  const [flash, setFlash] = useState({ type: '', message: '' });

  // Restore session on first load
  useEffect(() => {
    getMe()
      .then(({ user }) => setCurrentUser(user))
      .catch(() => setCurrentUser(null));
  }, []);

  const showFlash = (type, message) => {
    setFlash({ type, message });
    setTimeout(() => setFlash({ type: '', message: '' }), 4000);
  };

  const login = async (username, password) => {
    const data = await apiLogin({ username, password });
    setCurrentUser(data.user);
    showFlash('success', data.message);
    return data;
  };

  const signup = async (username, email, password) => {
    const data = await apiSignup({ username, email, password });
    setCurrentUser(data.user);
    showFlash('success', data.message);
    return data;
  };

  const logout = async () => {
    await apiLogout();
    setCurrentUser(null);
    showFlash('success', 'You have been logged out.');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, flash, showFlash }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
