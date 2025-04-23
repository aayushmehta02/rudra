'use client';

import { useSearchParams } from 'next/navigation';
import ResetPasswordPage from './ResetPassword';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return <ResetPasswordPage token={token} />;
} 