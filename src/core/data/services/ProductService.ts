import axios from 'axios';
import { Product, ProductInput, ProductSearchParams } from '@/core/domain/entities/Product';

export class ProductService {
  private readonly API_URL = 'https://dummyjson.com/products';

  async getProducts(params: ProductSearchParams): Promise<{ products: Product[]; total: number }> {
    try {
      const response = await axios.get(this.API_URL, { params });
      return {
        products: response.data.products,
        total: response.data.total,
      };
    } catch (error) {
      throw new Error('Không thể tải danh sách sản phẩm');
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await axios.get(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Không tìm thấy sản phẩm');
    }
  }

  async createProduct(product: ProductInput): Promise<Product> {
    try {
      const response = await axios.post(this.API_URL, product);
      return response.data;
    } catch (error) {
      throw new Error('Không thể tạo sản phẩm');
    }
  }

  async updateProduct(id: number, product: ProductInput): Promise<Product> {
    try {
      const response = await axios.put(`${this.API_URL}/${id}`, product);
      return response.data;
    } catch (error) {
      throw new Error('Không thể cập nhật sản phẩm');
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await axios.delete(`${this.API_URL}/${id}`);
    } catch (error) {
      throw new Error('Không thể xóa sản phẩm');
    }
  }
}