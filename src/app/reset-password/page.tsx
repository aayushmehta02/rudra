'use client';

import Loader from '@/components/common/Loader';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ResetPasswordWrapper = dynamic(
  () => import('@/components/auth/ResetPasswordWrapper'),
  {
    loading: () => <Loader />,
    ssr: false
  }
);

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordWrapper />
    </Suspense>
  );
}
