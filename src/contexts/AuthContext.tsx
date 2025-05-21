'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@/core/domain/entities/User';
import { AuthService } from '@/core/data/services/AuthService';

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component để quản lý trạng thái xác thực
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = new AuthService();

  // Kiểm tra trạng thái đăng nhập khi khởi tạo
  useEffect(() => {
    const user = authService.getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  // Xử lý đăng nhập
  const login = async (username: string, password: string) => {
    try {
      const user = await authService.login({ username, password });
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  // Xử lý đăng xuất
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook để sử dụng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};