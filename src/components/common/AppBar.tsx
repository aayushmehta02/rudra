"use client"
import { AccountCircle } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';

export default function AppBarComponent() {
    return(
        <AppBar position="fixed">
        <Toolbar>
          
          <Typography color="white" sx={{ mr: 1 }}>John doe</Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
          >
            <AccountCircle sx={{ color: '#f56565' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    )
}
