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
import { NotificationSettings } from '@/core/domain/entities/Settings';

const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean(),
  newOrderNotification: z.boolean(),
  orderStatusNotification: z.boolean(),
  lowStockNotification: z.boolean(),
  lowStockThreshold: z.number().min(1, 'Ngưỡng tồn kho phải lớn hơn 0'),
});

interface NotificationSettingsFormProps {
  settings: NotificationSettings;
  onSave: (data: NotificationSettings) => Promise<void>;
}

export default function NotificationSettingsForm({
  settings,
  onSave,
}: NotificationSettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: settings,
  });

  return (
    <Card>
      <CardHeader title="Cài đặt thông báo" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onSave)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('enableEmailNotifications')}
                    defaultChecked={settings.enableEmailNotifications}
                  />
                }
                label="Kích hoạt thông báo qua email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('newOrderNotification')}
                    defaultChecked={settings.newOrderNotification}
                  />
                }
                label="Thông báo đơn hàng mới"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('orderStatusNotification')}
                    defaultChecked={settings.orderStatusNotification}
                  />
                }
                label="Thông báo thay đổi trạng thái đơn hàng"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('lowStockNotification')}
                    defaultChecked={settings.lowStockNotification}
                  />
                }
                label="Thông báo hàng tồn kho thấp"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngưỡng tồn kho thấp"
                type="number"
                {...register('lowStockThreshold', { valueAsNumber: true })}
                error={!!errors.lowStockThreshold}
                helperText={errors.lowStockThreshold?.message}
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