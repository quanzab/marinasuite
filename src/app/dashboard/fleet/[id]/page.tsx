
'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getVesselById } from '@/lib/firestore';
import type { Vessel } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Ship, Tag, Wrench, Calendar, Users } from 'lucide-react';
import Image from 'next/image';

export default function VesselProfilePage({ params }: { params: { id: string } }) {
  const [vessel, setVessel] = useState<Vessel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const fetchVessel = async () => {
        setIsLoading(true);
        try {
          const fetchedVessel = await getVesselById(params.id);
          if (fetchedVessel) {
            setVessel(fetchedVessel);
          } else {
            setError('Vessel not found.');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch vessel data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchVessel();
    }
  }, [params.id]);

  if (isLoading) {
    return <VesselProfileSkeleton />;
  }

  if (error) {
    notFound();
  }
  
  if (!vessel) {
    return null; 
  }

  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="p-0">
               <Image 
                  src={`https://placehold.co/600x400.png`}
                  data-ai-hint="vessel ship"
                  alt={`Vessel image for ${vessel.name}`}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover"
                />
            </CardContent>
             <CardHeader>
                <CardTitle>{vessel.name}</CardTitle>
                <CardDescription>IMO: {vessel.imo}</CardDescription>
             </CardHeader>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3 grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                    <Ship className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Badge variant={vessel.status === 'In Service' ? 'default' : vessel.status === 'In Maintenance' ? 'outline' : 'secondary'}>
                    {vessel.status}
                    </Badge>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vessel Type</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-bold">{vessel.type}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Maintenance</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-bold">{vessel.nextMaintenance}</div>
                </CardContent>
            </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Assigned Crew
                </CardTitle>
                <CardDescription>Crew members currently assigned to this vessel.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Crew assignment feature coming soon.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Maintenance History
                </CardTitle>
                <CardDescription>Log of past maintenance and services.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Maintenance history feature coming soon.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


function VesselProfileSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-1/3">
                    <Card>
                       <Skeleton className="w-full h-[230px] rounded-t-lg" />
                       <CardHeader>
                           <Skeleton className="h-8 w-4/5 mb-2" />
                           <Skeleton className="h-4 w-1/2" />
                       </CardHeader>
                    </Card>
                </div>
                <div className="w-full md:w-2/3 grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status</CardTitle>
                            <Ship className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vessel Type</CardTitle>
                            <Tag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-7 w-32" />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Next Maintenance</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-7 w-24" />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                         <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
