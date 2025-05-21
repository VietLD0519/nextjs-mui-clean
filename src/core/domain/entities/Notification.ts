export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  linkTo?: string;
  read: boolean;
  createdAt: string;
  category: 'order' | 'user' | 'product' | 'system';
  data?: Record<string, any>;
}

export interface NotificationPreferences {
  email: boolean;
  desktop: boolean;
  browser: boolean;
}

export interface NotificationFilters {
  type?: NotificationType;
  category?: string;
  read?: boolean;
}