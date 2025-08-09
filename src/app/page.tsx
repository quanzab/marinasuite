
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// This component acts as a gatekeeper for the root URL.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to the dashboard, bypassing login.
    router.replace('/dashboard');
  }, [router]);

  // Render a full-page skeleton while loading to prevent flashes of content.
  return (
      <div className="flex items-center justify-center h-screen w-screen">
          <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
              </div>
          </div>
      </div>
  );
}
