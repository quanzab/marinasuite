
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // If user is authenticated and tries to access login, redirect them
        if (pathname.startsWith('/login')) {
            router.push('/dashboard/select-tenant');
        }
      } else {
        // If no user, redirect to login, unless they are already on the login page
        if (!pathname.startsWith('/login')) {
            router.push('/login');
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (isLoading) {
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

  // If user is not logged in and not on login page, render nothing while redirect happens
  if (!user && !pathname.startsWith('/login')) {
    return null;
  }
  
  // If user is logged in, but not on a dashboard page yet (e.g. at root), they will be redirected
  // by other logic. The tenant selection is part of the dashboard layout.
  if (user && pathname === '/') {
      router.push('/dashboard/select-tenant');
      return null;
  }

  return <>{children}</>;
}
