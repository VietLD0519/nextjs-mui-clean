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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { EmailSettings } from '@/core/domain/entities/Settings';

const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP Host là bắt buộc'),
  smtpPort: z.number().min(1, 'SMTP Port là bắt buộc'),
  smtpUser: z.string().min(1, 'SMTP User là bắt buộc'),
  smtpPassword: z.string().min(1, 'SMTP Password là bắt buộc'),
  senderName: z.string().min(1, 'Tên người gửi là bắt buộc'),
  senderEmail: z.string().email('Email không hợp lệ'),
  enableSSL: z.boolean(),
});

interface EmailSettingsFormProps {
  settings: EmailSettings;
  onSave: (data: EmailSettings) => Promise<void>;
}

export default function EmailSettingsForm({ settings, onSave }: EmailSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailSettings>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: settings,
  });

  return (
    <Card>
      <CardHeader title="Cài đặt Email" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onSave)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Host"
                {...register('smtpHost')}
                error={!!errors.smtpHost}
                helperText={errors.smtpHost?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Port"
                type="number"
                {...register('smtpPort', { valueAsNumber: true })}
                error={!!errors.smtpPort}
                helperText={errors.smtpPort?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP User"
                {...register('smtpUser')}
                error={!!errors.smtpUser}
                helperText={errors.smtpUser?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SMTP Password"
                type="password"
                {...register('smtpPassword')}
                error={!!errors.smtpPassword}
                helperText={errors.smtpPassword?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên người gửi"
                {...register('senderName')}
                error={!!errors.senderName}
                helperText={errors.senderName?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email người gửi"
                {...register('senderEmail')}
                error={!!errors.senderEmail}
                helperText={errors.senderEmail?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('enableSSL')}
                    defaultChecked={settings.enableSSL}
                  />
                }
                label="Kích hoạt SSL"
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