import { createContext, useState, useEffect, ReactNode } from "react";
import { useCookies } from "react-cookie";

interface User {
  email: string;
  name: string;
}

interface ContextProps {
  user: undefined | User;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<ContextProps>({
  user: undefined,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cookie] = useCookies(["user"]);
  useEffect(() => {
    if (cookie.user) {
      setIsAuthenticated(true);
      setUser(cookie.user);
    }
  }, [cookie.user]);
  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
