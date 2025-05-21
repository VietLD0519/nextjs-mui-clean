'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Order } from '@/core/domain/entities/Order';

interface OrderDetailsProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

export default function OrderDetails({ order, open, onClose }: OrderDetailsProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Chi tiết đơn hàng #{order.orderNumber}
        <Chip
          label={order.status.toUpperCase()}
          color={getStatusColor(order.status) as any}
          size="small"
          sx={{ ml: 2 }}
        />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Thông tin khách hàng */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin khách hàng
              </Typography>
              <Box>
                <Typography>
                  <strong>Tên:</strong> {order.customerName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {order.customerEmail}
                </Typography>
                <Typography>
                  <strong>Số điện thoại:</strong> {order.customerPhone}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Địa chỉ giao hàng */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Địa chỉ giao hàng
              </Typography>
              <Box>
                <Typography>{order.shippingAddress.street}</Typography>
                <Typography>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </Typography>
                <Typography>{order.shippingAddress.zipCode}</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Chi tiết đơn hàng */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Chi tiết đơn hàng
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="right">Giá</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                          />
                          {item.productName}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="subtitle1">Tổng cộng</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {/* Thông tin thanh toán */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin thanh toán
              </Typography>
              <Box>
                <Typography>
                  <strong>Phương thức:</strong> {order.paymentMethod}
                </Typography>
                <Typography>
                  <strong>Trạng thái:</strong>{' '}
                  <Chip
                    label={order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                    size="small"
                  />
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Thông tin thời gian */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thời gian
              </Typography>
              <Box>
                <Typography>
                  <strong>Tạo đơn:</strong> {formatDate(order.createdAt)}
                </Typography>
                <Typography>
                  <strong>Cập nhật:</strong> {formatDate(order.updatedAt)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}