import axios from 'axios';
import { UserRepository } from '../repositories/UserRepository';
import { UserData, UserInput, UserSearchParams } from '@/core/domain/entities/UserManagement';

export class UserService implements UserRepository {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/users';

  async getUsers(params: UserSearchParams): Promise<{ users: UserData[]; total: number }> {
    try {
      const response = await axios.get(this.API_URL);
      let users = response.data as UserData[];

      // Xử lý tìm kiếm nếu có query
      if (params.query) {
        const query = params.query.toLowerCase();
        users = users.filter(user => 
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
        );
      }

      // Xử lý phân trang
      const page = params.page || 1;
      const limit = params.limit || 10;
      const start = (page - 1) * limit;
      const paginatedUsers = users.slice(start, start + limit);

      return {
        users: paginatedUsers,
        total: users.length
      };
    } catch (error) {
      throw new Error('Không thể tải danh sách người dùng');
    }
  }

  async getUserById(id: number): Promise<UserData> {
    try {
      const response = await axios.get(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Không tìm thấy người dùng');
    }
  }

  async createUser(user: UserInput): Promise<UserData> {
    try {
      const response = await axios.post(this.API_URL, user);
      return response.data;
    } catch (error) {
      throw new Error('Không thể tạo người dùng');
    }
  }

  async updateUser(id: number, user: UserInput): Promise<UserData> {
    try {
      const response = await axios.put(`${this.API_URL}/${id}`, user);
      return response.data;
    } catch (error) {
      throw new Error('Không thể cập nhật người dùng');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await axios.delete(`${this.API_URL}/${id}`);
    } catch (error) {
      throw new Error('Không thể xóa người dùng');
    }
  }
}