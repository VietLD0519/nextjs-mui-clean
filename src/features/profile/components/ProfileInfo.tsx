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
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { UserProfile, ProfileUpdateInput } from '@/core/domain/entities/Profile';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Họ là bắt buộc'),
  lastName: z.string().min(1, 'Tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z.string().optional(),
  biography: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

interface ProfileInfoProps {
  profile: UserProfile;
  onUpdate: (data: ProfileUpdateInput) => Promise<void>;
  onAvatarUpdate: (file: File) => Promise<void>;
}

export default function ProfileInfo({
  profile,
  onUpdate,
  onAvatarUpdate,
}: ProfileInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      biography: profile.biography,
      address: profile.address,
    },
  });

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await onAvatarUpdate(file);
      } catch (error) {
        console.error('Error updating avatar:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader title="Thông tin cá nhân" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onUpdate)}>
          <Grid container spacing={3}>
            {/* Avatar */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box position="relative">
                <Avatar
                  src={profile.avatar}
                  sx={{ width: 120, height: 120 }}
                />
                <input
                  accept="image/*"
                  type="file"
                  id="avatar-upload"
                  hidden
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    <PhotoCameraIcon sx={{ color: 'white' }} />
                  </IconButton>
                </label>
              </Box>
            </Grid>

            {/* Thông tin cơ bản */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ"
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên"
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                {...register('phoneNumber')}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giới thiệu"
                multiline
                rows={4}
                {...register('biography')}
                error={!!errors.biography}
                helperText={errors.biography?.message}
              />
            </Grid>

            {/* Địa chỉ */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Địa chỉ
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                {...register('address.street')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Thành phố"
                {...register('address.city')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tỉnh/Thành"
                {...register('address.state')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mã bưu chính"
                {...register('address.zipCode')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quốc gia"
                {...register('address.country')}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}