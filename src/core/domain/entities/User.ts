// Định nghĩa interface cho người dùng
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

// Định nghĩa interface cho thông tin đăng nhập
export interface LoginCredentials {
  username: string;
  password: string;
}