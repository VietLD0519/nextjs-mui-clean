'use client';

import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationType } from '@/core/domain/entities/Notification';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    error,
    filters,
    setFilters,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  } = useNotifications();
  const router = useRouter();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const handleNotificationClick = async (id: string, linkTo?: string) => {
    try {
      await markAsRead(id);
      if (linkTo) {
        router.push(linkTo);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Thông báo
      </Typography>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Loại thông báo"
              value={filters.type || ''}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as NotificationType || undefined })}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="info">Thông tin</MenuItem>
              <MenuItem value="success">Thành công</MenuItem>
              <MenuItem value="warning">Cảnh báo</MenuItem>
              <MenuItem value="error">Lỗi</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Danh mục"
              value={filters.category || ''}
              onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="order">Đơn hàng</MenuItem>
              <MenuItem value="product">Sản phẩm</MenuItem>
              <MenuItem value="user">Người dùng</MenuItem>
              <MenuItem value="system">Hệ thống</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Trạng thái"
              value={filters.read === undefined ? '' : filters.read}
              onChange={(e) => setFilters({
                ...filters,
                read: e.target.value === '' ? undefined : e.target.value === 'true'
              })}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="false">Chưa đọc</MenuItem>
              <MenuItem value="true">Đã đọc</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button onClick={() => markAllAsRead()}>
            Đánh dấu tất cả đã đọc
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="textSecondary">
              Không có thông báo nào
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification) => (
              <Paper
                key={notification.id}
                sx={{
                  mb: 2,
                  backgroundColor: notification.read ? 'inherit' : 'action.hover',
                }}
              >
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notification.id, notification.linkTo)}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {notification.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={notification.category}
                          color={notification.read ? 'default' : 'primary'}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block' }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </Typography>
                      </>
                    }
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}