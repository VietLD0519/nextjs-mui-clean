'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
} from '@mui/material';
import GeneralSettingsForm from '@/features/settings/components/GeneralSettingsForm';
import EmailSettingsForm from '@/features/settings/components/EmailSettingsForm';
import NotificationSettingsForm from '@/features/settings/components/NotificationSettingsForm';
import SecuritySettingsForm from '@/features/settings/components/SecuritySettingsForm';
import { SettingsService } from '@/core/data/services/SettingsService';
import { SystemSettings } from '@/core/domain/entities/Settings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const settingsService = new SettingsService();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      showNotification('Không thể tải cài đặt', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSaveGeneral = async (data: SystemSettings['general']) => {
    try {
      await settingsService.saveSettings({ general: data });
      showNotification('Đã lưu cài đặt chung', 'success');
      loadSettings();
    } catch (error) {
      showNotification('Không thể lưu cài đặt', 'error');
    }
  };

  const handleSaveEmail = async (data: SystemSettings['email']) => {
    try {
      await settingsService.saveSettings({ email: data });
      showNotification('Đã lưu cài đặt email', 'success');
      loadSettings();
    } catch (error) {
      showNotification('Không thể lưu cài đặt', 'error');
    }
  };

  const handleSaveNotification = async (data: SystemSettings['notification']) => {
    try {
      await settingsService.saveSettings({ notification: data });
      showNotification('Đã lưu cài đặt thông báo', 'success');
      loadSettings();
    } catch (error) {
      showNotification('Không thể lưu cài đặt', 'error');
    }
  };

  const handleSaveSecurity = async (data: SystemSettings['security']) => {
    try {
      await settingsService.saveSettings({ security: data });
      showNotification('Đã lưu cài đặt bảo mật', 'success');
      loadSettings();
    } catch (error) {
      showNotification('Không thể lưu cài đặt', 'error');
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography color="error">
          Không thể tải cài đặt. Vui lòng thử lại sau.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Cài đặt hệ thống
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="settings tabs"
        >
          <Tab label="Cài đặt chung" />
          <Tab label="Email" />
          <Tab label="Thông báo" />
          <Tab label="Bảo mật" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <GeneralSettingsForm
          settings={settings.general}
          onSave={handleSaveGeneral}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <EmailSettingsForm
          settings={settings.email}
          onSave={handleSaveEmail}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <NotificationSettingsForm
          settings={settings.notification}
          onSave={handleSaveNotification}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <SecuritySettingsForm
          settings={settings.security}
          onSave={handleSaveSecurity}
        />
      </TabPanel>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}