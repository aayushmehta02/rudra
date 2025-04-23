'use client';

import { Suspense } from 'react';
import Loader from '../common/Loader';
import ResetPasswordPage from './ResetPassword';

export default function ResetPasswordWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordPage />
    </Suspense>
  );
} 