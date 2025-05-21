import axios from 'axios';
import { Order, OrderSearchParams, OrderStatusUpdate } from '@/core/domain/entities/Order';

export class OrderService {
  private readonly API_URL = 'https://api.example.com/orders'; // Thay thế bằng API thực tế

  async getOrders(params: OrderSearchParams): Promise<{ orders: Order[]; total: number }> {
    try {
      // Mock data cho demo
      const orders: Order[] = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        orderNumber: `ORD-${2025}${String(index + 1).padStart(4, '0')}`,
        userId: Math.floor(Math.random() * 100) + 1,
        customerName: `Khách hàng ${index + 1}`,
        customerEmail: `customer${index + 1}@example.com`,
        customerPhone: `0${Math.floor(Math.random() * 1000000000)}`,
        shippingAddress: {
          street: `${index + 1} Đường ABC`,
          city: 'Hà Nội',
          state: 'HN',
          zipCode: '100000',
        },
        items: [
          {
            id: index + 1,
            productId: Math.floor(Math.random() * 100) + 1,
            productName: `Sản phẩm ${index + 1}`,
            productImage: 'https://via.placeholder.com/150',
            quantity: Math.floor(Math.random() * 5) + 1,
            price: Math.floor(Math.random() * 1000000) + 100000,
            subtotal: Math.floor(Math.random() * 1000000) + 100000,
          },
        ],
        status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][
          Math.floor(Math.random() * 5)
        ] as OrderStatus,
        totalAmount: Math.floor(Math.random() * 10000000) + 1000000,
        paymentMethod: ['COD', 'Banking', 'Momo'][Math.floor(Math.random() * 3)],
        paymentStatus: Math.random() > 0.5 ? 'paid' : 'unpaid',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Xử lý tìm kiếm
      let filteredOrders = [...orders];
      if (params.query) {
        const query = params.query.toLowerCase();
        filteredOrders = filteredOrders.filter(
          order =>
            order.orderNumber.toLowerCase().includes(query) ||
            order.customerName.toLowerCase().includes(query) ||
            order.customerEmail.toLowerCase().includes(query)
        );
      }

      if (params.status) {
        filteredOrders = filteredOrders.filter(order => order.status === params.status);
      }

      if (params.startDate) {
        filteredOrders = filteredOrders.filter(
          order => new Date(order.createdAt) >= new Date(params.startDate!)
        );
      }

      if (params.endDate) {
        filteredOrders = filteredOrders.filter(
          order => new Date(order.createdAt) <= new Date(params.endDate!)
        );
      }

      // Xử lý phân trang
      const page = params.page || 1;
      const limit = params.limit || 10;
      const start = (page - 1) * limit;
      const paginatedOrders = filteredOrders.slice(start, start + limit);

      return {
        orders: paginatedOrders,
        total: filteredOrders.length,
      };
    } catch (error) {
      throw new Error('Không thể tải danh sách đơn hàng');
    }
  }

  async getOrderById(id: number): Promise<Order> {
    try {
      const response = await axios.get(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Không tìm thấy đơn hàng');
    }
  }

  async updateOrderStatus(id: number, update: OrderStatusUpdate): Promise<Order> {
    try {
      const response = await axios.patch(`${this.API_URL}/${id}/status`, update);
      return response.data;
    } catch (error) {
      throw new Error('Không thể cập nhật trạng thái đơn hàng');
    }
  }
}