import ResetPasswordPage from '@/components/auth/ResetPassword';
import { Suspense } from 'react';

export default function ResetPasswordWrapper({searchParams}: {searchParams: {token: string}}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage searchParams={searchParams} />
    </Suspense>
  );
}
