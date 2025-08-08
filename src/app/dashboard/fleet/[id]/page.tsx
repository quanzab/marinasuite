
'use client';

import { useEffect, useState, useTransition } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getVesselById, getCrew } from '@/lib/firestore';
import type { Vessel, CrewMember } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Ship, Tag, Wrench, Calendar, Users, Wand2, Loader2, User } from 'lucide-react';
import Image from 'next/image';
import { generateNewImageAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}


export default function VesselProfilePage({ params }: { params: { id: string } }) {
  const [vessel, setVessel] = useState<Vessel | null>(null);
  const [assignedCrew, setAssignedCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, startTransition] = useTransition();
  const { toast } = useToast();
  const { user: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const isManagerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedVessel, allCrew] = await Promise.all([
          getVesselById(params.id),
          getCrew()
      ]);
      
      if (fetchedVessel) {
        setVessel(fetchedVessel);
        const crewForVessel = allCrew.filter(c => c.assignedVessel === fetchedVessel.name);
        setAssignedCrew(crewForVessel);
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


  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleGenerateImage = () => {
    startTransition(async () => {
        toast({ title: 'AI Image Generation', description: 'The AI is creating a new image. This may take a moment...' });
        const result = await generateNewImageAction(params.id);
        if (result.success && result.imageUrl) {
            setVessel(prev => prev ? { ...prev, imageUrl: result.imageUrl } : null);
            toast({ title: 'Success!', description: 'New vessel image has been generated.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    });
  }

  if (isLoading) {
    return <VesselProfileSkeleton />;
  }

  if (error) {
    notFound();
  }
  
  if (!vessel) {
    return null; 
  }

  const imageUrl = vessel.imageUrl || `https://placehold.co/600x400.png`;

  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="p-0 relative">
               <Image 
                  key={vessel.imageUrl}
                  src={imageUrl}
                  data-ai-hint="vessel ship"
                  alt={`Vessel image for ${vessel.name}`}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover"
                />
                 {isGenerating && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                 )}
            </CardContent>
             <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{vessel.name}</CardTitle>
                        <CardDescription>IMO: {vessel.imo}</CardDescription>
                    </div>
                     <Button 
                        size="sm" 
                        onClick={handleGenerateImage} 
                        disabled={isGenerating || !isManagerOrAdmin || isUserLoading}
                     >
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                        <span className="ml-2 hidden sm:inline">Generate Image</span>
                     </Button>
                </div>
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
                {assignedCrew.length > 0 ? (
                  <div className="space-y-3">
                    {assignedCrew.map(member => (
                      <Link href={`/dashboard/crew/${member.id}`} key={member.id} className="flex items-center gap-3 hover:bg-muted p-2 rounded-lg">
                         <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                            <AvatarFallback>{getAvatarFallback(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.rank}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No crew members assigned.</p>
                )}
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
                     <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
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

