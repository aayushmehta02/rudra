'use client';
//file that provides susupense boundary
import { Suspense } from 'react';
import Loader from '../common/Loader';
import ResetPasswordClient from './ResetPasswordClient';

export default function ResetPasswordWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordClient />
    </Suspense>
  );
} 