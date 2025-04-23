'use client';

import { SIGNUP_USER } from '@/graphql/auth';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useMutation } from '@apollo/client';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SALT_ROUNDS = 10;

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [customError, setCustomError] = useState('');
  const { showSnackbar } = useSnackbar();

  const [signupUser, { loading }] = useMutation(SIGNUP_USER, {
    fetchPolicy: 'no-cache'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setCustomError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setCustomError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setCustomError('Password must be at least 8 characters long');
      return false;
    }

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      
      showSnackbar('Please enter a valid email address', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');

    if (!validateForm()) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    try {

      const hashedPassword = await bcrypt.hash(formData.password, SALT_ROUNDS);

    
      const { data } = await signupUser({
        variables: {
          username: formData.username,
          email: formData.email,
          password: hashedPassword
        },
      });
      
      const user = data?.insert_Users?.returning?.[0];
      if (user) {
        
        const userToStore = {
          id: user.id,
          username: user.username,
          email: user.email
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        localStorage.setItem('token', user.id);
        showSnackbar('Signup successful. Redirecting to home...', 'success');
        router.push('/home');
      } else {
        setCustomError('Signup failed. Please try again.');
        showSnackbar('Signup failed. Please try again.');
      }
    } catch (err: Error | unknown) {
      console.error('Signup error:', err);
      
      if (err instanceof Error && err.message?.includes('Uniqueness violation')) {
        setCustomError('This email is already registered');
      } else {
        setCustomError('Signup failed. Please try again.');
      }
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

        {customError && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {customError}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
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
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="filled"
            required
            InputProps={{
              style: { backgroundColor: '#1c1c24', color: '#fff' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ color: '#aaa' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: '#aaa' },
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            variant="filled"
            required
            InputProps={{
              style: { backgroundColor: '#1c1c24', color: '#fff' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                    sx={{ color: '#aaa' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: '#aaa' },
            }}
          />

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
            {loading ? 'Signing up...' : 'SIGN UP'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
