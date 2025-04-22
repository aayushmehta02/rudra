'use client';

import { Box } from '@mui/material';

export function Background() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        background: '#0e0e10',
        overflow: 'hidden',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: '35vw',
          height: '35vw',
          borderRadius: '15% 85% 85% 15% / 15% 15% 85% 85%',
          filter: 'blur(80px)',
          opacity: 0.15,
          pointerEvents: 'none',
          left: '50%',
          transform: 'translateX(-50%)',
        },
        '&::before': {
          background: 'linear-gradient(135deg, #0066ff 0%, #0044ff 100%)',
          top: '20%',
        },
        '&::after': {
          background: 'linear-gradient(135deg, #0066ff 0%, #0044ff 100%)',
          bottom: '20%',
        },
      }}
    />
  );
} 