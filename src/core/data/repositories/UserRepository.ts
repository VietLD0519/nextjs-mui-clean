import { UserData, UserInput, UserSearchParams } from '@/core/domain/entities/UserManagement';

export interface UserRepository {
  getUsers(params: UserSearchParams): Promise<{ users: UserData[]; total: number }>;
  getUserById(id: number): Promise<UserData>;
  createUser(user: UserInput): Promise<UserData>;
  updateUser(id: number, user: UserInput): Promise<UserData>;
  deleteUser(id: number): Promise<void>;
}