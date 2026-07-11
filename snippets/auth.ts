import { useState, useEffect } from 'react';
import axios from 'axios';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const useAuth = (): [AuthState, (token: string) => void, () => void] => {
  const [authState, setAuthState] = useState<AuthState>({
    token: localStorage.getItem('jwtToken'),
    isAuthenticated: !!localStorage.getItem('jwtToken'),
  });

  useEffect(() => {
    if (authState.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authState.token]);

  const login = (token: string): void => {
    localStorage.setItem('jwtToken', token);
    setAuthState({ token, isAuthenticated: true });
  };

  const logout = (): void => {
    localStorage.removeItem('jwtToken');
    setAuthState({ token: null, isAuthenticated: false });
  };

  return [authState, login, logout];
};

export default useAuth;