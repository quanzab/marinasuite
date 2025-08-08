
'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getCrewMemberById } from '@/lib/firestore';
import type { CrewMember } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Ship, ShieldCheck, FileText } from 'lucide-react';

export default function CrewProfilePage({ params }: { params: { id: string } }) {
  const [crewMember, setCrewMember] = useState<CrewMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const fetchCrewMember = async () => {
        setIsLoading(true);
        try {
          const member = await getCrewMemberById(params.id);
          if (member) {
            setCrewMember(member);
          } else {
            setError('Crew member not found.');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch crew member data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCrewMember();
    }
  }, [params.id]);

  if (isLoading) {
    return <CrewProfileSkeleton />;
  }

  if (error) {
    // This will render the nearest not-found.js or a default Next.js 404 page
    notFound();
  }
  
  if (!crewMember) {
    return null; 
  }

  const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="flex flex-col gap-4">
       <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${crewMember.id}`} />
          <AvatarFallback>{getAvatarFallback(crewMember.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">{crewMember.name}</h1>
          <p className="text-muted-foreground">{crewMember.rank}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={crewMember.status === 'Active' ? 'default' : crewMember.status === 'On Leave' ? 'outline' : 'secondary'}>
              {crewMember.status}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Vessel</CardTitle>
             <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{crewMember.assignedVessel || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Certifications
                </CardTitle>
                <CardDescription>List of qualifications and certificates.</CardDescription>
            </CardHeader>
            <CardContent>
                {crewMember.certifications && crewMember.certifications.length > 0 ? (
                     <ul className="space-y-2">
                        {crewMember.certifications.map(cert => (
                            <li key={cert} className="text-sm">{cert}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No certifications listed.</p>
                )}
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Medical Records
                </CardTitle>
                <CardDescription>Summary of medical status.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{crewMember.medicalRecords || 'No medical records on file.'}</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


function CrewProfileSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assigned Vessel</CardTitle>
                        <Ship className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       <Skeleton className="h-7 w-24" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
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

