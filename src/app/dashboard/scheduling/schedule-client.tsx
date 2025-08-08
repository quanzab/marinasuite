
'use client';

import { useState, useEffect, useCallback } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CrewMember, Vessel } from "@/lib/types";
import { getCrew, getVessels } from "@/lib/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ScheduleClient() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Crew</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : (
              crew.filter(c => c.status === 'Active' && !c.assignedVessel).map(member => (
                <Card key={member.id} className="p-3">
                  <div className="flex items-center gap-3">
                     <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                        <AvatarFallback>{getAvatarFallback(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.rank}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-9">
         <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day.toISOString()} className="text-center p-2 rounded-t-lg bg-card border">
              <p className="font-semibold text-sm">{format(day, 'E')}</p>
              <p className="text-xs text-muted-foreground">{format(day, 'd')}</p>
            </div>
          ))}
          <div className="col-span-7 grid grid-cols-7 min-h-[60vh] border-l border-b rounded-b-lg">
            {weekDays.map(day => (
              <div key={day.toISOString()} className="border-r p-2 space-y-2">
                {/* Assignments for this day will go here */}
                {/* Example of an assignment card */}
                {day.getDay() === 2 && (
                    <Card className="p-2 bg-muted/50">
                        <p className="text-xs font-bold">Ocean Explorer</p>
                        <Badge variant="secondary" className="mt-1">
                          John Doe
                        </Badge>
                    </Card>
                )}
              </div>
            ))}
          </div>
         </div>
      </div>
    </div>
  );
}
