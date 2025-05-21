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
import { GeneralSettings } from '@/core/domain/entities/Settings';

const generalSettingsSchema = z.object({
  siteName: z.string().min(1, 'Tên trang web là bắt buộc'),
  siteDescription: z.string(),
  contactEmail: z.string().email('Email không hợp lệ'),
  contactPhone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  address: z.string(),
  logo: z.string().url('URL không hợp lệ').optional(),
  favicon: z.string().url('URL không hợp lệ').optional(),
});

interface GeneralSettingsFormProps {
  settings: GeneralSettings;
  onSave: (data: GeneralSettings) => Promise<void>;
}

export default function GeneralSettingsForm({ settings, onSave }: GeneralSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GeneralSettings>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: settings,
  });

  return (
    <Card>
      <CardHeader title="Cài đặt chung" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onSave)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên trang web"
                {...register('siteName')}
                error={!!errors.siteName}
                helperText={errors.siteName?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email liên hệ"
                {...register('contactEmail')}
                error={!!errors.contactEmail}
                helperText={errors.contactEmail?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                {...register('contactPhone')}
                error={!!errors.contactPhone}
                helperText={errors.contactPhone?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={3}
                {...register('siteDescription')}
                error={!!errors.siteDescription}
                helperText={errors.siteDescription?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                multiline
                rows={2}
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL Logo"
                {...register('logo')}
                error={!!errors.logo}
                helperText={errors.logo?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL Favicon"
                {...register('favicon')}
                error={!!errors.favicon}
                helperText={errors.favicon?.message}
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