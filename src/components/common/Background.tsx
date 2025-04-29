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
        zIndex: -1,
        background: 'theme.palette.background.default',
        overflow: 'hidden',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.1,
          pointerEvents: 'none',
        },
        '&::before': {
          background: 'linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%)',
          top: '-10%',
          left: '-10%',
        },
        '&::after': {
          background: 'linear-gradient(135deg, #2b6cb0 0%, #1a365d 100%)',
          bottom: '-10%',
          right: '-10%',
        },
      }}
    />
  );
} 