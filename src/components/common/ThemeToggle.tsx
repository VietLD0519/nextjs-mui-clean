'use client';

import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps extends Omit<IconButtonProps, 'children'> {
  showTooltip?: boolean;
}

export default function ThemeToggle({ showTooltip = true, ...props }: ThemeToggleProps) {
  const { mode, toggleTheme } = useTheme();
  const isLight = mode === 'light';

  const button = (
    <IconButton
      color="inherit"
      onClick={toggleTheme}
      aria-label={`Chuyển sang chế độ ${isLight ? 'tối' : 'sáng'}`}
      {...props}
    >
      {isLight ? <DarkMode /> : <LightMode />}
    </IconButton>
  );

  if (!showTooltip) return button;

  return (
    <Tooltip title={`Chuyển sang chế độ ${isLight ? 'tối' : 'sáng'}`}>
      {button}
    </Tooltip>
  );
}