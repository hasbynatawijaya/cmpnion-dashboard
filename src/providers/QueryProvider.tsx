import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '@/api/client';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(createQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
