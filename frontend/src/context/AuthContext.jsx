import { createContext, useContext, useMemo, useState } from "react";
import { apiRequest } from "../api";

const AuthContext = createContext(null);

function getStoredUser() {
  const raw = localStorage.getItem("devden_user");
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const saveSession = (payload) => {
    localStorage.setItem("devden_token", payload.token);
    localStorage.setItem("devden_user", JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    saveSession(response);
    return response;
  };

  const register = async (payload) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    saveSession(response);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("devden_token");
    localStorage.removeItem("devden_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
