'use client';

import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import StatsCard from '@/features/dashboard/components/StatsCard';
import SalesChart from '@/features/dashboard/components/SalesChart';
import TopProductsTable from '@/features/dashboard/components/TopProductsTable';
import { DashboardService } from '@/core/data/services/DashboardService';
import { DashboardStats, SalesData, ProductStats } from '@/core/domain/entities/Dashboard';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardService = new DashboardService();
        const [statsData, sales, products] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getSalesData(),
          dashboardService.getTopProducts(),
        ]);

        setStats(statsData);
        setSalesData(sales);
        setTopProducts(products);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={3}>
      {/* Thống kê tổng quan */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Tổng người dùng"
          value={stats?.totalUsers || 0}
          icon={<PeopleIcon />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Tổng sản phẩm"
          value={stats?.totalProducts || 0}
          icon={<InventoryIcon />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Tổng đơn hàng"
          value={stats?.totalOrders || 0}
          icon={<ShoppingCartIcon />}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Doanh thu"
          value={
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(stats?.revenue || 0)
          }
          icon={<MoneyIcon />}
          color="error"
        />
      </Grid>

      {/* Biểu đồ doanh số */}
      <Grid item xs={12}>
        <SalesChart data={salesData} />
      </Grid>

      {/* Bảng top sản phẩm */}
      <Grid item xs={12} md={6}>
        <TopProductsTable products={topProducts} />
      </Grid>
    </Grid>
  );
}