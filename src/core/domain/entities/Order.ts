export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string;
  updatedAt: string;
}

export interface OrderSearchParams {
  query?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  note?: string;
}