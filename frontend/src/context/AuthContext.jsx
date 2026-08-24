import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authLogin, authRegister, authVerifyOtp, authResendOtp, authMe } from '../utils/api';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('vc_token'));
  const [loading, setLoading] = useState(true);

  // Rehydrate on load
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    authMe(token)
      .then(({ data }) => setUser(data))
      .catch(() => { localStorage.removeItem('vc_token'); setToken(null); })
      .finally(() => setLoading(false));
  }, [token]);

  const saveToken = useCallback((t) => {
    localStorage.setItem('vc_token', t);
    setToken(t);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authLogin(email, password);
    saveToken(data.token);
    setUser(data.user);
    return data;
  }, [saveToken]);

  const register = useCallback(async (email, password, name) => {
    const { data } = await authRegister(email, password, name);
    return data;
  }, []);

  const verifyOtp = useCallback(async (email, code) => {
    const { data } = await authVerifyOtp(email, code);
    saveToken(data.token);
    setUser(data.user);
    return data;
  }, [saveToken]);

  const resendOtp = useCallback(async (email) => {
    const { data } = await authResendOtp(email);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vc_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, verifyOtp, resendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
