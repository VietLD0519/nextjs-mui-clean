export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface SalesData {
  date: string;
  amount: number;
}

export interface ProductStats {
  name: string;
  sales: number;
  revenue: number;
}