// Interface định nghĩa các phương thức xác thực
import { LoginCredentials, User } from '@/core/domain/entities/User';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  logout(): void;
  getCurrentUser(): User | null;
}