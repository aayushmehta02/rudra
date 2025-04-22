'use client';

import { apolloClient } from '@/lib/apollo-client';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client';

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseApolloProvider client={apolloClient}>
      {children}
    </BaseApolloProvider>
  );
} 