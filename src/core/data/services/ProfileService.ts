import { UserProfile, ProfileUpdateInput, PasswordChangeInput } from '@/core/domain/entities/Profile';

export class ProfileService {
  private readonly API_URL = 'https://api.example.com/profile';

  // Lấy thông tin profile
  async getProfile(): Promise<UserProfile> {
    // Mock data cho demo
    return {
      id: 1,
      username: 'VietLD0519',
      email: 'vietld@example.com',
      firstName: 'Việt',
      lastName: 'Lê',
      avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      phoneNumber: '0987654321',
      address: {
        street: '123 Đường ABC',
        city: 'Hà Nội',
        state: 'HN',
        zipCode: '100000',
        country: 'Việt Nam',
      },
      biography: 'Frontend Developer',
      role: 'Admin',
      permissions: ['manage_users', 'manage_products', 'manage_orders'],
      lastLogin: '2025-05-21T01:21:03Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-05-21T01:21:03Z',
      preferences: {
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        notifications: {
          email: true,
          browser: true,
          mobile: false,
        },
      },
    };
  }

  // Cập nhật thông tin profile
  async updateProfile(data: ProfileUpdateInput): Promise<UserProfile> {
    try {
      // Trong thực tế sẽ gọi API
      const currentProfile = await this.getProfile();
      const updatedProfile = {
        ...currentProfile,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return updatedProfile;
    } catch (error) {
      throw new Error('Không thể cập nhật thông tin');
    }
  }

  // Cập nhật avatar
  async updateAvatar(file: File): Promise<string> {
    try {
      // Mock upload avatar
      return URL.createObjectURL(file);
    } catch (error) {
      throw new Error('Không thể cập nhật ảnh đại diện');
    }
  }

  // Đổi mật khẩu
  async changePassword(data: PasswordChangeInput): Promise<void> {
    try {
      // Kiểm tra mật khẩu hiện tại
      if (data.currentPassword === '123456') {
        if (data.newPassword === data.confirmPassword) {
          return;
        }
        throw new Error('Mật khẩu mới không khớp');
      }
      throw new Error('Mật khẩu hiện tại không đúng');
    } catch (error) {
      throw error;
    }
  }
}