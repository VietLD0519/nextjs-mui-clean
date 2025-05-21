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
import { SecuritySettings } from '@/core/domain/entities/Settings';

const securitySettingsSchema = z.object({
  passwordMinLength: z.number().min(6, 'Độ dài tối thiểu phải từ 6 ký tự'),
  passwordRequireUppercase: z.boolean(),
  passwordRequireNumbers: z.boolean(),
  passwordRequireSymbols: z.boolean(),
  maxLoginAttempts: z.number().min(1, 'Số lần thử tối đa phải lớn hơn 0'),
  lockoutDuration: z.number().min(1, 'Thời gian khóa phải lớn hơn 0'),
  sessionTimeout: z.number().min(1, 'Thời gian phiên phải lớn hơn 0'),
  enableTwoFactor: z.boolean(),
});

interface SecuritySettingsFormProps {
  settings: SecuritySettings;
  onSave: (data: SecuritySettings) => Promise<void>;
}

export default function SecuritySettingsForm({
  settings,
  onSave,
}: SecuritySettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SecuritySettings>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: settings,
  });

  return (
    <Card>
      <CardHeader title="Cài đặt bảo mật" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onSave)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Độ dài mật khẩu tối thiểu"
                type="number"
                {...register('passwordMinLength', { valueAsNumber: true })}
                error={!!errors.passwordMinLength}
                helperText={errors.passwordMinLength?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('passwordRequireUppercase')}
                    defaultChecked={settings.passwordRequireUppercase}
                  />
                }
                label="Yêu cầu chữ hoa"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('passwordRequireNumbers')}
                    defaultChecked={settings.passwordRequireNumbers}
                  />
                }
                label="Yêu cầu số"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('passwordRequireSymbols')}
                    defaultChecked={settings.passwordRequireSymbols}
                  />
                }
                label="Yêu cầu ký tự đặc biệt"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số lần đăng nhập sai tối đa"
                type="number"
                {...register('maxLoginAttempts', { valueAsNumber: true })}
                error={!!errors.maxLoginAttempts}
                helperText={errors.maxLoginAttempts?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Thời gian khóa (phút)"
                type="number"
                {...register('lockoutDuration', { valueAsNumber: true })}
                error={!!errors.lockoutDuration}
                helperText={errors.lockoutDuration?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Thời gian phiên làm việc (phút)"
                type="number"
                {...register('sessionTimeout', { valueAsNumber: true })}
                error={!!errors.sessionTimeout}
                helperText={errors.sessionTimeout?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register('enableTwoFactor')}
                    defaultChecked={settings.enableTwoFactor}
                  />
                }
                label="Kích hoạt xác thực 2 yếu tố"
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