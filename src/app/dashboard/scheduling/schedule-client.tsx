
'use client';

import { useState, useEffect, useCallback } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CrewMember, Vessel } from "@/lib/types";
import { getCrew, getVessels, updateCrewMember } from "@/lib/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Ship } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function ScheduleClient() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const isManagerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [crewData, vesselData] = await Promise.all([getCrew(), getVessels()]);
      setCrew(crewData);
      setVessels(vesselData);
    } catch (error) {
      console.error("Failed to fetch scheduling data", error);
      toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load scheduling data.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleAssignVessel = async (crewId: string, vesselId: string) => {
    try {
        await updateCrewMember(crewId, { assignedVessel: vesselId });
        toast({
            title: "Success",
            description: "Crew member assigned successfully.",
        });
        fetchData(); // Refresh all data
    } catch (error) {
        console.error("Error assigning vessel:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to assign vessel.',
        });
    }
  };

  const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const assignedCrewByVessel = vessels.reduce((acc, vessel) => {
    acc[vessel.id] = crew.filter(c => c.assignedVessel === vessel.id);
    return acc;
  }, {} as Record<string, CrewMember[]>);

  const unassignedCrew = crew.filter(c => c.status === 'Active' && !c.assignedVessel);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <div className="md:col-span-3 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Crew</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : (
              unassignedCrew.length > 0 ?
              unassignedCrew.map(member => (
                <Card key={member.id} className="p-3">
                  <div className="flex items-center gap-3">
                     <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                        <AvatarFallback>{getAvatarFallback(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.rank}</p>
                    </div>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!isManagerOrAdmin || isUserLoading}>
                           <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuLabel>Assign to Vessel</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         {vessels.map(vessel => (
                            <DropdownMenuItem key={vessel.id} onClick={() => handleAssignVessel(member.id, vessel.id)}>
                                {vessel.name}
                            </DropdownMenuItem>
                         ))}
                      </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
                </Card>
              ))
              : <p className="text-sm text-muted-foreground p-4 text-center">No active crew available.</p>
            )}
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Vessel Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
               Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : (
              vessels.map(vessel => (
                <div key={vessel.id}>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Ship className="w-4 h-4 text-primary"/>
                    {vessel.name}
                  </h4>
                  <div className="p-2 rounded-lg bg-muted/50 min-h-[50px] space-y-2">
                     {assignedCrewByVessel[vessel.id]?.length > 0 ? (
                        assignedCrewByVessel[vessel.id].map(member => (
                           <Card key={member.id} className="p-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                                    <AvatarFallback>{getAvatarFallback(member.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-xs">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.rank}</p>
                                </div>
                            </div>
                           </Card>
                        ))
                     ) : (
                        <p className="text-xs text-muted-foreground p-2 text-center">No crew assigned</p>
                     )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-9">
         <div className="grid grid-cols-1 sm:grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day.toISOString()} className="text-center p-2 rounded-t-lg bg-card border-b-0 border">
              <p className="font-semibold text-sm">{format(day, 'E')}</p>
              <p className="text-xs text-muted-foreground">{format(day, 'd')}</p>
            </div>
          ))}
          <div className="col-span-1 sm:col-span-7 grid grid-cols-1 sm:grid-cols-7 min-h-[60vh] border-l border-b rounded-b-lg">
            {weekDays.map(day => (
              <div key={day.toISOString()} className="border-r p-2 space-y-2 min-h-[100px] sm:min-h-0">
                {/* This area is the drop zone for a full calendar implementation */}
              </div>
            ))}
          </div>
         </div>
      </div>
    </div>
  );
}

    