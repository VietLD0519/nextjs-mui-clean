'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Typography,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { OrderService } from '@/core/data/services/OrderService';
import { Order, OrderStatus, OrderStatusUpdate } from '@/core/domain/entities/Order';
import OrderDetails from '@/features/orders/components/OrderDetails';

const orderStatuses: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipped', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const orderService = new OrderService();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await orderService.getOrders({
        ...searchParams,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      });
      setOrders(result.orders);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [searchParams, startDate, endDate]);

  const handleSearch = (query: string) => {
    setSearchParams({ ...searchParams, query, page: 1 });
  };

  const handleStatusFilter = (status: OrderStatus | '') => {
    setSearchParams({
      ...searchParams,
      status: status || undefined,
      page: 1,
    });
  };

  const handlePageChange = (event: unknown, page: number) => {
    setSearchParams({ ...searchParams, page });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setOpenDetails(true);
  };

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpenStatusDialog(true);
  };

  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus) {
      try {
        await orderService.updateOrderStatus(selectedOrder.id, {
          status: newStatus,
        });
        loadOrders();
        setOpenStatusDialog(false);
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Quản lý đơn hàng
      </Typography>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm đơn hàng..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Trạng thái"
              value={searchParams.status || ''}
              onChange={(e) => handleStatusFilter(e.target.value as OrderStatus | '')}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {orderStatuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DatePicker
                label="Từ ngày"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="dd/MM/yyyy"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DatePicker
                label="Đến ngày"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="dd/MM/yyyy"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell align="right">Tổng tiền</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thanh toán</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không có đơn hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={orderStatuses.find(s => s.value === order.status)?.label}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(order)}
                        title="Xem chi tiết"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditStatus(order)}
                        title="Cập nhật trạng thái"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(total / searchParams.limit)}
            page={searchParams.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Paper>

      {/* Dialog chi tiết đơn hàng */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          open={openDetails}
          onClose={() => setOpenDetails(false)}
        />
      )}

      {/* Dialog cập nhật trạng thái */}
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
            sx={{ mt: 2 }}
          >
            {orderStatuses.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Hủy</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}