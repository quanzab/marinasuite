
'use client';

import { useRouter } from 'next/navigation';
import { Building, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';
import { mockUsers } from '@/lib/data';

// In a real app, you would fetch the user's tenants from your database
// based on the logged-in user's ID.
const userTenants = Array.from(new Set(mockUsers.map(u => u.tenant)));

export default function TenantSelectionPage() {
  const router = useRouter();

  const handleTenantSelect = (tenant: string) => {
    // In a real app, you would store the selected tenant in a global state
    // (e.g., Context, Redux, Zustand) or a session cookie.
    console.log(`Selected tenant: ${tenant}`);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md">
        <div className="grid gap-4 text-center mb-6">
            <Logo className="w-12 h-12 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">Select Your Tenant</h1>
            <p className="text-balance text-muted-foreground">Choose the organization you want to sign into.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Available Tenants</CardTitle>
            <CardDescription>You have access to the following organizations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              {userTenants.map((tenant) => (
                <Button
                  key={tenant}
                  variant="outline"
                  className="w-full justify-between h-14 text-left"
                  onClick={() => handleTenantSelect(tenant)}
                >
                  <div className='flex items-center'>
                    <div className="mr-4 rounded-md bg-primary/10 p-2">
                        <Building className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-semibold">{tenant}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
         <div className="mt-4 text-center text-sm">
            <Button variant="link" onClick={() => router.push('/login')}>
              Back to Login
            </Button>
        </div>
      </div>
    </div>
  );
}
