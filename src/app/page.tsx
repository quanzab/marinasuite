
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';

// This component acts as a gatekeeper for the root URL.
export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // If user is logged in, send them to the tenant selection screen.
        router.push('/dashboard/select-tenant');
      } else {
        // Otherwise, send them to the login page.
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  // Render nothing while the logic runs.
  return null;
}
