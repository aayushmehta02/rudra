'use client';

import { AccountCircle } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

export default function AppBarComponent() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <Typography color="white" sx={{ mr: 1 }}>
            John Doe
          </Typography>
          <IconButton size="large" edge="end" color="inherit">
            <AccountCircle sx={{ color: '#f56565' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
