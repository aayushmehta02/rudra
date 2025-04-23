'use client';

import ResetPasswordPage from '@/components/auth/ResetPassword';
import { Suspense } from 'react';

export default function ResetPasswordWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
