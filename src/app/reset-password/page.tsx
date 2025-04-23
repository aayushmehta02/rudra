import Loader from '@/components/common/Loader';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ResetPasswordPage = dynamic(() => import('@/components/auth/ResetPassword'), {
  loading: () => <Loader />,
  ssr: false
});

export default function ResetPasswordWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
