import { SystemSettings } from '@/core/domain/entities/Settings';

export class SettingsService {
  private readonly STORAGE_KEY = 'system_settings';

  // Tải cài đặt từ localStorage (trong thực tế sẽ là từ API)
  async getSettings(): Promise<SystemSettings> {
    try {
      const savedSettings = localStorage.getItem(this.STORAGE_KEY);
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
      return this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  // Lưu cài đặt
  async saveSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        ...settings,
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      throw new Error('Không thể lưu cài đặt');
    }
  }

  // Cài đặt mặc định
  private getDefaultSettings(): SystemSettings {
    return {
      general: {
        siteName: 'Admin Dashboard',
        siteDescription: 'Hệ thống quản trị',
        contactEmail: 'admin@example.com',
        contactPhone: '0123456789',
        address: 'Hà Nội, Việt Nam',
      },
      email: {
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        senderName: 'Admin System',
        senderEmail: 'noreply@example.com',
        enableSSL: true,
      },
      notification: {
        enableEmailNotifications: true,
        newOrderNotification: true,
        orderStatusNotification: true,
        lowStockNotification: true,
        lowStockThreshold: 10,
      },
      security: {
        passwordMinLength: 8,
        passwordRequireUppercase: true,
        passwordRequireNumbers: true,
        passwordRequireSymbols: true,
        maxLoginAttempts: 5,
        lockoutDuration: 30,
        sessionTimeout: 60,
        enableTwoFactor: false,
      },
    };
  }
}