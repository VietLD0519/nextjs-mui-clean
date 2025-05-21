// Định nghĩa interface cho thông tin người dùng từ API
export interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
}

// Interface cho tham số tạo/cập nhật user
export interface UserInput {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

// Interface cho tham số tìm kiếm
export interface UserSearchParams {
  query?: string;
  page?: number;
  limit?: number;
}