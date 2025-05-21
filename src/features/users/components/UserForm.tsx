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
  Box,
} from '@mui/material';
import { UserInput, UserData } from '@/core/domain/entities/UserManagement';

// Schema validation cho form
const userSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc'),
  username: z.string().min(1, 'Tên đăng nhập là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  website: z.string().url('Website không hợp lệ').optional(),
});

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserInput) => Promise<void>;
  initialData?: UserData;
  title: string;
}

export default function UserForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmitHandler = async (data: UserInput) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      // Lỗi đã được xử lý ở component cha
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                {...register('website')}
                error={!!errors.website}
                helperText={errors.website?.message}
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
      </Box>
    </Dialog>
  );
}