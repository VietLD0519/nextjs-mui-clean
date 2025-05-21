'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { ProductService } from '@/core/data/services/ProductService';
import { Product, ProductInput, ProductSearchParams } from '@/core/domain/entities/Product';
import ProductForm from '@/features/products/components/ProductForm';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<ProductSearchParams>({
    page: 1,
    limit: 12,
  });
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const productService = new ProductService();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await productService.getProducts(searchParams);
      setProducts(result.products);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchParams({ ...searchParams, query, page: 1 });
  };

  const handlePageChange = (event: unknown, page: number) => {
    setSearchParams({ ...searchParams, page });
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setOpenForm(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete.id);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
      setOpenDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const handleSubmit = async (data: ProductInput) => {
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, data);
      } else {
        await productService.createProduct(data);
      }
      loadProducts();
      setOpenForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Quản lý sản phẩm</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm sản phẩm..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Danh mục"
              value={searchParams.category || ''}
              onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value, page: 1 })}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="electronics">Điện tử</MenuItem>
              <MenuItem value="clothing">Thời trang</MenuItem>
              {/* Thêm các danh mục khác */}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Trạng thái"
              value={searchParams.status || ''}
              onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value, page: 1 })}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>Loading...</Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {product.description}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price)}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleEdit(product)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(product)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(total / (searchParams.limit || 12))}
                page={searchParams.page || 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Paper>

      <ProductForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        initialData={selectedProduct}
        title={selectedProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
      />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa sản phẩm {productToDelete?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}