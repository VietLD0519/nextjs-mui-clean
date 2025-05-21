import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

// Cấu hình font Roboto
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Tạo theme mặc định
const theme = createTheme({
  // Cấu hình bảng màu
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Màu chính
    },
    secondary: {
      main: '#dc004e', // Màu phụ
    },
    background: {
      default: '#f5f5f5', // Màu nền mặc định
      paper: '#ffffff', // Màu nền các thành phần
    },
  },
  // Cấu hình typography
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  // Tùy chỉnh các component
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Không viết hoa chữ trong button
        },
      },
    },
  },
});

export default theme;