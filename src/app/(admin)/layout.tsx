import ThemeToggle from '@/components/common/ThemeToggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ... (code khác)

  return (
    <NotificationProvider>
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <ThemeToggle />
            <NotificationBell />
            <Typography variant="h6" noWrap component="div" sx={{ ml: 2 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
          </Toolbar>
        </AppBar>
        {/* ... (code khác) */}
      </Box>
    </NotificationProvider>
  );
}