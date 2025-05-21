import { Notification, NotificationFilters } from '@/core/domain/entities/Notification';

export class NotificationService {
  private readonly STORAGE_KEY = 'notifications';

  // Mock data cho demo
  private generateMockNotifications(): Notification[] {
    const currentDate = new Date('2025-05-21T01:25:28Z');
    
    return [
      {
        id: '1',
        type: 'success',
        title: 'Đơn hàng mới',
        message: 'Đơn hàng #ORD-2025001 vừa được tạo',
        linkTo: '/orders/1',
        read: false,
        createdAt: new Date(currentDate.getTime() - 5 * 60000).toISOString(),
        category: 'order',
        data: { orderId: 'ORD-2025001' }
      },
      {
        id: '2',
        type: 'warning',
        title: 'Sản phẩm sắp hết hàng',
        message: 'Sản phẩm "Laptop ABC" đang ở mức tồn kho thấp',
        linkTo: '/products/2',
        read: false,
        createdAt: new Date(currentDate.getTime() - 30 * 60000).toISOString(),
        category: 'product',
        data: { productId: 2, stock: 5 }
      },
      {
        id: '3',
        type: 'info',
        title: 'Người dùng mới đăng ký',
        message: 'Người dùng mới vừa tạo tài khoản',
        linkTo: '/users/3',
        read: true,
        createdAt: new Date(currentDate.getTime() - 2 * 3600000).toISOString(),
        category: 'user'
      },
      {
        id: '4',
        type: 'error',
        title: 'Lỗi hệ thống',
        message: 'Có lỗi xảy ra trong quá trình backup dữ liệu',
        read: true,
        createdAt: new Date(currentDate.getTime() - 24 * 3600000).toISOString(),
        category: 'system'
      }
    ];
  }

  // Lấy danh sách thông báo
  async getNotifications(filters?: NotificationFilters): Promise<Notification[]> {
    try {
      let notifications = this.generateMockNotifications();

      if (filters) {
        if (filters.type) {
          notifications = notifications.filter(n => n.type === filters.type);
        }
        if (filters.category) {
          notifications = notifications.filter(n => n.category === filters.category);
        }
        if (filters.read !== undefined) {
          notifications = notifications.filter(n => n.read === filters.read);
        }
      }

      return notifications.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      throw new Error('Không thể tải thông báo');
    }
  }

  // Đánh dấu thông báo đã đọc
  async markAsRead(notificationId: string): Promise<void> {
    try {
      // Trong thực tế sẽ gọi API
      console.log('Marked notification as read:', notificationId);
    } catch (error) {
      throw new Error('Không thể cập nhật trạng thái thông báo');
    }
  }

  // Đánh dấu tất cả thông báo đã đọc
  async markAllAsRead(): Promise<void> {
    try {
      // Trong thực tế sẽ gọi API
      console.log('Marked all notifications as read');
    } catch (error) {
      throw new Error('Không thể cập nhật trạng thái thông báo');
    }
  }

  // Xóa thông báo
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      // Trong thực tế sẽ gọi API
      console.log('Deleted notification:', notificationId);
    } catch (error) {
      throw new Error('Không thể xóa thông báo');
    }
  }
}