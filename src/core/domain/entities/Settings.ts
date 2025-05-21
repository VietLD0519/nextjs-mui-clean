export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo?: string;
  favicon?: string;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  senderName: string;
  senderEmail: string;
  enableSSL: boolean;
}

export interface NotificationSettings {
  enableEmailNotifications: boolean;
  newOrderNotification: boolean;
  orderStatusNotification: boolean;
  lowStockNotification: boolean;
  lowStockThreshold: number;
}

export interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
  sessionTimeout: number;
  enableTwoFactor: boolean;
}

export interface SystemSettings {
  general: GeneralSettings;
  email: EmailSettings;
  notification: NotificationSettings;
  security: SecuritySettings;
}