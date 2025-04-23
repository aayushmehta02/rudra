'use client';

import { UPDATE_PASSWORD } from '@/graphql/auth';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useMutation } from '@apollo/client';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import bcrypt from 'bcryptjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SALT_ROUNDS = 10;

interface DecodedToken {
  userId: string;
  email: string;
  username: string;
  exp: number;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ use this instead of props
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const [updatePassword] = useMutation(UPDATE_PASSWORD);

  useEffect(() => {
    const token = searchParams.get('token'); // ✅ read directly here
    if (!token) {
      setError('Invalid reset link - No token provided');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('/api/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (response.ok && data.valid) {
          setDecodedToken(data.decoded);
          setTokenValid(true);
          setError('');
        } else {
          setError(data.message || 'Invalid or expired reset link');
          setTokenValid(false);
        }
      } catch (err) {
        console.error('Error verifying reset link:', err);
        setError('An error occurred while verifying the reset link');
        setTokenValid(false);
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
    setError('');
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !decodedToken) return;

    setLoading(true);
    setError('');

    try {
      const hashedPassword = await bcrypt.hash(formData.password, SALT_ROUNDS);

      const { data } = await updatePassword({
        variables: {
          userId: decodedToken.userId,
          newPassword: hashedPassword,
        },
      });

      if (data?.update_Users_by_pk?.id) {
        showSnackbar('Password reset successful', 'success');
        router.push('/');
      } else {
        setError('Failed to update password. Please try again.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
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
          <Typography variant="h6" align="center" sx={{ color: '#ff4d4d', mb: 3 }}>
            {error}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push('/forgot-password')}
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: '#0ab4ff',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#0899db' },
            }}
          >
            Request New Reset Link
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => router.push('/')}
            sx={{
              mt: 2,
              py: 1.5,
              color: '#fff',
              borderColor: '#ffffff3b',
              '&:hover': { borderColor: '#fff' },
            }}
          >
            Back to Login
          </Button>
        </Paper>
      </Box>
    );
  }

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
          sx={{ fontWeight: 'bold', color: '#fff', mb: 3 }}
        >
          Reset Your Password
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="filled"
            required
            InputProps={{ style: { backgroundColor: '#1c1c24', color: '#fff' } }}
            InputLabelProps={{ style: { color: '#aaa' } }}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            variant="filled"
            required
            InputProps={{ style: { backgroundColor: '#1c1c24', color: '#fff' } }}
            InputLabelProps={{ style: { color: '#aaa' } }}
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
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
