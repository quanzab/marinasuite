
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isAuthed = !!user;
      setIsAuthenticated(isAuthed);

      if (!isAuthed && !pathname.startsWith('/login')) {
        router.push('/login');
      } else if (isAuthed && pathname.startsWith('/login')) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  // While checking auth status, show a loading skeleton.
  if (isAuthenticated === null) {
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

  // If the user is authenticated, or is on the login page, show the children.
  // The redirect logic inside useEffect will handle routing them away from login if needed.
  if (isAuthenticated || pathname.startsWith('/login')) {
      // At the root, decide where to go.
      if (pathname === '/') {
          if (isAuthenticated) {
              router.push('/dashboard');
          } else {
              router.push('/login');
          }
          return null;
      }
      return <>{children}</>;
  }


  // If not authenticated and not on login page, render nothing while redirecting.
  return null;
}
