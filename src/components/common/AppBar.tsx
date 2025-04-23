'use client';

import { AccountCircle } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function AppBarComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const user = localStorage.getItem('user');
    setUser(JSON.parse(user || '{}'));
  }, []);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <Typography color="white" sx={{ mr: 1 }}>
            {isLoggedIn ? user?.username : 'FutureKonnect'}
          </Typography>
          <IconButton size="large" edge="end" color="inherit">
            <AccountCircle sx={{ color: '#f56565' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
