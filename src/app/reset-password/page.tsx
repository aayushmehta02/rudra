import ResetPasswordClient from '@/components/auth/ResetPasswordClient';
import Loader from '@/components/common/Loader';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
