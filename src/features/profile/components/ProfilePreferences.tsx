// ... (import statements)
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfilePreferences({
  preferences,
  onUpdate,
}: ProfilePreferencesProps) {
  const { mode, toggleTheme } = useTheme();
  
  // ... (code khác)

  return (
    <Card>
      <CardHeader title="Tùy chọn" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onUpdate)}>
          <Grid container spacing={3}>
            {/* ... (các field khác) */}

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Giao diện
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleTheme}
                  />
                }
                label="Chế độ tối"
              />
            </Grid>

            {/* ... (code khác) */}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}