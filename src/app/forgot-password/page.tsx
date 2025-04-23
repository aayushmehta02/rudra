'use client';

import ForgotPassword from '@/components/auth/ForgotPassword';
import { Background } from '@/components/common/Background';
import { Box } from '@mui/material';

export default function ForgotPasswordPage() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Background />
      <ForgotPassword />
    </Box>
  );
} 