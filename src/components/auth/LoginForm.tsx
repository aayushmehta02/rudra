'use client';

import { LOGIN_USER } from '@/graphql/auth';
import { useLazyQuery } from '@apollo/client';
import {
    Box,
    Button,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loginUser, { data, loading, error: gqlError }] = useLazyQuery(LOGIN_USER);

//   useEffect(() => {
//     if (data) {
//       console.log('Login response:', data);
//     }
//   }, [data]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginUser({ variables: { email, password } });
      console.log('Login response:', data);
      if (data.Users.length === 1) {
        console.log('Login response:', data);
        localStorage.setItem('token', data.Users[0].id);
        window.location.href = '/home';
      }
    //   if (data?.loginUser.token) {
    //     localStorage.setItem('token', data.loginUser.token);
    //     window.location.href = '/';
    //   }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
    
        
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        overflow: 'hidden',

      }}
    >
      <Paper
        elevation={8}
        sx={{
        background: 'linear-gradient(145deg, #0f1115, #14161a)',
          padding: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#fff' }}
        >
          future<span style={{ color: '#0ab4ff' }}>konnect</span>
        </Typography>

        {error || gqlError ? (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error || gqlError?.message}
          </Typography>
        ) : null}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="filled"
            InputProps={{
              style: { backgroundColor: '#1c1c24', color: '#fff' },
            }}
            InputLabelProps={{
              style: { color: '#aaa' },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="filled"
            InputProps={{
              style: { backgroundColor: '#1c1c24', color: '#fff' },
            }}
            InputLabelProps={{
              style: { color: '#aaa' },
            }}
          />

          <Box textAlign="right" mt={1}>
            <Link href="/forgot-password" underline="hover" sx={{ color: '#0ab4ff' }}>
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              bgcolor: '#0ab4ff',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#0899db' },
            }}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
