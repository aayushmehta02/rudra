'use client';

import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.authWrapper}>
          {isLogin ? <LoginForm /> : <SignupForm />}
          <button
            className={styles.toggleButton}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
      </main>
    </div>
  );
}
