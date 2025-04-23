'use client';

import { LOGIN_USER } from '@/graphql/auth';
import { useLazyQuery } from '@apollo/client';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import bcrypt from 'bcryptjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    fetchPolicy: 'no-cache' // Important: Don't cache login results
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const { data } = await loginUser({ 
        variables: { email }
      });

      if (!data?.Users || data.Users.length === 0) {
        setError('Invalid email or password');
        return;
      }

      const user = data.Users[0];
      
      try {
        // Verify the password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          setError('Invalid email or password');
          return;
        }

        // Store user info in localStorage (never store passwords)
        const userToStore = {
          id: user.id,
          username: user.username,
          email: user.email
        };
        
        localStorage.setItem('user', JSON.stringify(userToStore));
        localStorage.setItem('token', user.id);

        // Use Next.js router for navigation
        router.push('/home');
      } catch (bcryptError) {
        console.error('Password verification error:', bcryptError);
        setError('Login failed. Please try again.');
      }
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

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="filled"
            required
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
            required
            InputProps={{
              style: { backgroundColor: '#1c1c24', color: '#fff' },
            }}
            InputLabelProps={{
              style: { color: '#aaa' },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
       
            <Link 
              href="/forgot-password" 
              style={{ 
                color: '#0ab4ff', 
                textDecoration: 'none'
              }}
              className="hover:underline"
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
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
