'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { PasswordChangeInput } from '@/core/domain/entities/Profile';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
  newPassword: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
    ),
  confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

interface ProfileSecurityProps {
  onChangePassword: (data: PasswordChangeInput) => Promise<void>;
}

export default function ProfileSecurity({ onChangePassword }: ProfileSecurityProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordChangeInput) => {
    try {
      await onChangePassword(data);
      reset();
    } catch (error) {
      // Lỗi đã được xử lý ở component cha
    }
  };

  return (
    <Card>
      <CardHeader title="Bảo mật" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Mật khẩu hiện tại"
                {...register('currentPassword')}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Mật khẩu mới"
                {...register('newPassword')}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Xác nhận mật khẩu mới"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}