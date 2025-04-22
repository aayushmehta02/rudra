'use client';

import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { Background } from '@/components/common/Background';
import Triangle from '@/components/Traingle';
import { Box, Button, Container } from '@mui/material';
import { useState } from 'react';
export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      
      <Background />
      <Box position="absolute" top={"35%"} left={0} zIndex={10}>
  <Triangle
    direction="right"
   
   
  />
</Box>


      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {isLogin ? <LoginForm /> : <SignupForm />}
            <Button
              onClick={() => setIsLogin(!isLogin)}
              sx={{
                mt: 2,
                color: '#0066ff',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'rgba(0, 102, 255, 0.08)',
                },
              }}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </Button>
          </Box>
        </Container>
      </Box>
      <Box position="absolute" top={"35%"} right={0} zIndex={10}>
  <Triangle
    direction="left"
   
    
    
  />
</Box>
    </Box>
  );
}
