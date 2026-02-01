import { useEffect, useState, type ReactNode } from "react";
import { AuthService } from "../services/auth.service";
import { AuthContext } from "../contexts/AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await AuthService.getCurrentUser();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await AuthService.login(email, password);
    setUser(data.user);
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ) => {
    const data = await AuthService.register(fullName, email, password);
    setUser(data.user);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
