import { DashboardStats, ChartData, SalesData, ProductStats } from '@/core/domain/entities/Dashboard';
import { format, subDays } from 'date-fns';

export class DashboardService {
  // Mock data cho demo
  async getStats(): Promise<DashboardStats> {
    return {
      totalUsers: 1250,
      totalProducts: 456,
      totalOrders: 789,
      revenue: 123456,
    };
  }

  async getSalesData(): Promise<SalesData[]> {
    // Mock data 7 ngày gần nhất
    return Array.from({ length: 7 }).map((_, index) => ({
      date: format(subDays(new Date(), index), 'yyyy-MM-dd'),
      amount: Math.floor(Math.random() * 10000),
    })).reverse();
  }

  async getTopProducts(): Promise<ProductStats[]> {
    return [
      { name: 'Sản phẩm A', sales: 120, revenue: 12000 },
      { name: 'Sản phẩm B', sales: 100, revenue: 10000 },
      { name: 'Sản phẩm C', sales: 80, revenue: 8000 },
      { name: 'Sản phẩm D', sales: 60, revenue: 6000 },
      { name: 'Sản phẩm E', sales: 40, revenue: 4000 },
    ];
  }
}