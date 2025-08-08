
'use client';

import { useRouter } from 'next/navigation';
import { Building, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Skeleton } from '@/components/ui/skeleton';

// Mock tenants for the demo. In a real app, this would come from the user's profile.
const tenants = [
    { id: 'global_maritime', name: 'Global Maritime' },
    { id: 'coastal_shipping', name: 'Coastal Shipping' },
    { id: 'offshore_innovations', name: 'Offshore Innovations' },
];

export default function SelectTenantPage() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  const handleSelectTenant = (tenantId: string) => {
    // In a real application, you would set the selected tenant in a global state/context
    // and potentially update the user's session or a cookie.
    console.log(`Tenant selected: ${tenantId}`);
    // For now, we just redirect to the main dashboard.
    router.push('/dashboard');
  };

  if (isLoading) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-background">
              <Card className="w-full max-w-md">
                  <CardHeader>
                      <Skeleton className="h-8 w-3/4 mx-auto" />
                      <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Select Organization</CardTitle>
          <CardDescription className="text-center">
            Choose which organization you want to manage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => handleSelectTenant(tenant.id)}
              className="w-full text-left p-4 rounded-lg border flex items-center gap-4 hover:bg-muted transition-colors"
            >
              <Building className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">{tenant.name}</p>
                <p className="text-sm text-muted-foreground">Access as {user?.role}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
