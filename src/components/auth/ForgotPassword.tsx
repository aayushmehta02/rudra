'use client';

import { REQUEST_PASSWORD_RESET } from '@/graphql/auth';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useLazyQuery } from '@apollo/client';
import emailjs from '@emailjs/browser';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  // Get EmailJS configuration from environment variables
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

  // Validate EmailJS configuration
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.error('EmailJS configuration is missing');
    throw new Error('EmailJS configuration is required');
  }

  // Initialize EmailJS
  emailjs.init(EMAILJS_PUBLIC_KEY);

  const [formData, setFormData] = useState({
    email: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [checkUser] = useLazyQuery(REQUEST_PASSWORD_RESET, {
    fetchPolicy: 'no-cache'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user exists
      const { data } = await checkUser({
        variables: {
          email: formData.email.toLowerCase(),
          username: formData.username.toLowerCase()
        }
      });

      if (!data?.Users || data.Users.length === 0) {
        showSnackbar('No account found with these credentials', 'error');
        return;
      }

      const user = data.Users[0];

      // Generate reset token
      const response = await fetch('/api/send-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          username: user.username,
          userId: user.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate reset token');
      }

      // Send email
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          link: result.data?.resetUrl || '',
          email: user.email,
          to_name: user.username,
          from_name: "FutureKonnect"
        },
        EMAILJS_PUBLIC_KEY
      );

      showSnackbar('Password reset link has been sent to your email', 'success');
      setFormData({ email: '', username: '' }); // Clear form
    } catch (err) {
      console.error('Password reset error:', err);
      showSnackbar(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        minHeight: '100vh',
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
          sx={{ fontWeight: 'bold', color: '#fff', mb: 3 }}
        >
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Box textAlign="center" mt={2}>
            <Link 
              href="/login" 
              style={{ 
                color: '#0ab4ff', 
                textDecoration: 'none' 
              }}
            >
              Back to Login
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}