'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { UserService } from '@/core/data/services/UserService';
import { UserData, UserInput, UserSearchParams } from '@/core/domain/entities/UserManagement';

interface UserManagementContextType {
  users: UserData[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedUser: UserData | null;
  searchParams: UserSearchParams;
  getUsers: (params: UserSearchParams) => Promise<void>;
  getUserById: (id: number) => Promise<void>;
  createUser: (user: UserInput) => Promise<void>;
  updateUser: (id: number, user: UserInput) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setSearchParams: (params: UserSearchParams) => void;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    page: 1,
    limit: 10,
  });

  const userService = new UserService();

  const getUsers = async (params: UserSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getUsers(params);
      setUsers(result.users);
      setTotal(result.total);
    } catch (error) {
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const user = await userService.getUserById(id);
      setSelectedUser(user);
    } catch (error) {
      setError('Không tìm thấy người dùng');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (user: UserInput) => {
    setLoading(true);
    setError(null);
    try {
      await userService.createUser(user);
      getUsers(searchParams); // Refresh danh sách
    } catch (error) {
      setError('Không thể tạo người dùng');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, user: UserInput) => {
    setLoading(true);
    setError(null);
    try {
      await userService.updateUser(id, user);
      getUsers(searchParams); // Refresh danh sách
    } catch (error) {
      setError('Không thể cập nhật người dùng');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await userService.deleteUser(id);
      getUsers(searchParams); // Refresh danh sách
    } catch (error) {
      setError('Không thể xóa người dùng');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserManagementContext.Provider
      value={{
        users,
        total,
        loading,
        error,
        selectedUser,
        searchParams,
        getUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        setSearchParams,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
}

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error('useUserManagement phải được sử dụng trong UserManagementProvider');
  }
  return context;
};