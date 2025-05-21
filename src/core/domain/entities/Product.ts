export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  status: 'active' | 'inactive';
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  status: 'active' | 'inactive';
}

export interface ProductSearchParams {
  query?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}