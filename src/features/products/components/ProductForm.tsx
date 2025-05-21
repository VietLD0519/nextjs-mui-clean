'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import { Product, ProductInput } from '@/core/domain/entities/Product';

const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  price: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  category: z.string().min(1, 'Danh mục là bắt buộc'),
  stock: z.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
  image: z.string().url('URL hình ảnh không hợp lệ'),
  status: z.enum(['active', 'inactive']),
});

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductInput) => Promise<void>;
  initialData?: Product;
  title: string;
}

export default function ProductForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmitHandler = async (data: ProductInput) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      // Xử lý lỗi
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên sản phẩm"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={4}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giá"
                type="number"
                {...register('price', { valueAsNumber: true })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Danh mục"
                {...register('category')}
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số lượng"
                type="number"
                {...register('stock', { valueAsNumber: true })}
                error={!!errors.stock}
                helperText={errors.stock?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Trạng thái"
                {...register('status')}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL hình ảnh"
                {...register('image')}
                error={!!errors.image}
                helperText={errors.image?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}