import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("financeToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("financeToken");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  function saveLogin(data) {
    localStorage.setItem("financeToken", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("financeToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, saveLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
