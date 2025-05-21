// Triển khai các phương thức xác thực
import axios from 'axios';
import { AuthRepository } from '../repositories/AuthRepository';
import { LoginCredentials, User } from '@/core/domain/entities/User';

export class AuthService implements AuthRepository {
  private readonly API_URL = 'https://dummyjson.com';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user';

  // Phương thức đăng nhập
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await axios.post(`${this.API_URL}/auth/login`, credentials);
      const user = response.data;
      
      // Lưu thông tin xác thực vào localStorage
      localStorage.setItem(this.TOKEN_KEY, user.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw new Error('Đăng nhập thất bại');
    }
  }

  // Phương thức đăng xuất
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Phương thức lấy thông tin người dùng hiện tại
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}