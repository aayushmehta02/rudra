'use client';

import { Box, CircularProgress } from '@mui/material';

export default function Loader() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        minHeight: '100vh',
        bgcolor: '#0d1421',
      }}
    >
      <CircularProgress
        sx={{
          color: '#0ab4ff',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
        size={40}
        thickness={4}
      />
    </Box>
  );
} 