export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  biography?: string;
  role: string;
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      browser: boolean;
      mobile: boolean;
    };
  };
}

export interface ProfileUpdateInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  biography?: string;
  preferences?: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      browser: boolean;
      mobile: boolean;
    };
  };
}

export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}