'use client';

import { SIGNUP_USER } from '@/graphql/auth';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import styles from './Auth.module.css';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customError, setCustomError] = useState('');

  const [signupUser, { data, loading, error }] = useMutation(SIGNUP_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');

    try {
      console.log('Signing up with:', { username, email, password });
      const res = await signupUser({
        variables: {
          username,
          email,
          password,
        },
      });
      console.log('Signup response:', res);
      const user = res.data?.insert_users?.returning?.[0];
      console.log('User:', user);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User signed up:', user);
        // Optionally: redirect user to login/dashboard
      }
    } catch (err) {
      setCustomError('Signup failed. Please try again.');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Sign Up</h2>
      {(customError || error) && (
            <div className={styles.error}>{customError || error?.message}</div>
        )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
