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
  Grid,
} from '@mui/material';
import { UserProfile, ProfileUpdateInput } from '@/core/domain/entities/Profile';
import { ProfileService } from '@/core/data/services/ProfileService';
import ProfileInfo from '@/features/profile/components/ProfileInfo';
import ProfileSecurity from '@/features/profile/components/ProfileSecurity';
import ProfilePreferences from '@/features/profile/components/ProfilePreferences';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const profileService = new ProfileService();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      showNotification('Không thể tải thông tin profile', 'error');
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

  const handleUpdateProfile = async (data: ProfileUpdateInput) => {
    try {
      const updated = await profileService.updateProfile(data);
      setProfile(updated);
      showNotification('Cập nhật thông tin thành công', 'success');
    } catch (error) {
      showNotification('Không thể cập nhật thông tin', 'error');
    }
  };

  const handleUpdateAvatar = async (file: File) => {
    try {
      const avatarUrl = await profileService.updateAvatar(file);
      setProfile((prev) => prev ? { ...prev, avatar: avatarUrl } : null);
      showNotification('Cập nhật ảnh đại diện thành công', 'success');
    } catch (error) {
      showNotification('Không thể cập nhật ảnh đại diện', 'error');
    }
  };

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await profileService.changePassword(data);
      showNotification('Đổi mật khẩu thành công', 'success');
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, 'error');
      } else {
        showNotification('Không thể đổi mật khẩu', 'error');
      }
    }
  };

  const handleUpdatePreferences = async (preferences: UserProfile['preferences']) => {
    try {
      const updated = await profileService.updateProfile({
        ...profile!,
        preferences,
      });
      setProfile(updated);
      showNotification('Cập nhật tùy chọn thành công', 'success');
    } catch (error) {
      showNotification('Không thể cập nhật tùy chọn', 'error');
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

  if (!profile) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography color="error">
          Không thể tải thông tin profile. Vui lòng thử lại sau.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Thông tin tài khoản
      </Typography>

      {/* Thông tin cơ bản trên đầu trang */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="h6">
              {profile.firstName} {profile.lastName}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              @{profile.username}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              {profile.role}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="profile tabs"
        >
          <Tab label="Thông tin cá nhân" />
          <Tab label="Bảo mật" />
          <Tab label="Tùy chọn" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <ProfileInfo
          profile={profile}
          onUpdate={handleUpdateProfile}
          onAvatarUpdate={handleUpdateAvatar}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ProfileSecurity onChangePassword={handleChangePassword} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ProfilePreferences
          preferences={profile.preferences}
          onUpdate={handleUpdatePreferences}
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