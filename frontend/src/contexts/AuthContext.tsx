import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "farmer" | "consumer";

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  address: string;
  state: string;
  district: string;
  role: UserRole;
  // Farmer-specific
  farmAddress?: string;
  landSize?: string;
  primaryCrop?: string;
  farmingType?: string;
  // Consumer-specific
  occupation?: string;
  email?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (u: UserProfile) => setUser(u);
  const logout = () => setUser(null);
  const updateUser = (updates: Partial<UserProfile>) =>
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  const deleteAccount = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};
