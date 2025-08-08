
'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CrewMember, Vessel } from "@/lib/types";
import { getCrew, getVessels, updateCrewMember } from "@/lib/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ship } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
  useDraggable
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTenant } from "@/hooks/use-tenant";

const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function DraggableCrewMember({ member }: { member: CrewMember }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: member.id,
        data: { crewMember: member },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="p-3 touch-none"
        >
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                    <AvatarFallback>{getAvatarFallback(member.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.rank}</p>
                </div>
            </div>
        </Card>
    );
}

function DroppableVessel({ vessel, crew }: { vessel: Vessel, crew: CrewMember[] }) {
    const { isOver, setNodeRef } = useDroppable({
        id: vessel.id,
        data: { vessel },
    });

    return (
        <div key={vessel.id}>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Ship className="w-4 h-4 text-primary" />
                {vessel.name}
            </h4>
            <div
                ref={setNodeRef}
                className={`p-2 rounded-lg bg-muted/50 min-h-[70px] space-y-2 transition-colors ${isOver ? 'bg-primary/20' : ''}`}
            >
                {crew.map(member => (
                    <DraggableCrewMember key={member.id} member={member} />
                ))}
                {crew.length === 0 && (
                     <p className="text-xs text-muted-foreground p-2 text-center">Drop crew here</p>
                )}
            </div>
        </div>
    )
}


export default function ScheduleClient() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor));
  const { tenantId } = useTenant();

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const fetchData = useCallback(async () => {
    if (!tenantId) return;
    setIsLoading(true);
    try {
      const [crewData, vesselData] = await Promise.all([getCrew(tenantId), getVessels(tenantId)]);
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
  }, [toast, tenantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const assignedCrewByVessel = useMemo(() => vessels.reduce((acc, vessel) => {
    acc[vessel.id] = crew.filter(c => c.assignedVessel === vessel.name);
    return acc;
  }, {} as Record<string, CrewMember[]>), [vessels, crew]);

  const unassignedCrew = useMemo(() => crew.filter(c => c.status === 'Active' && !c.assignedVessel), [crew]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;
    
    if (!tenantId) return;

    if (!over) {
        return;
    }

    const crewMemberId = active.id as string;
    const crewMember = crew.find(c => c.id === crewMemberId);
    if (!crewMember) return;

    const newVesselId = over.id as string;
    const oldVesselName = crewMember.assignedVessel;

    // Unassigning
    if (newVesselId === 'unassigned') {
        if (oldVesselName) {
            await updateCrewMember(tenantId, crewMemberId, { assignedVessel: null });
            fetchData();
            toast({ title: 'Success', description: `${crewMember.name} is now unassigned.` });
        }
        return;
    }

    const newVessel = vessels.find(v => v.id === newVesselId);
    if (!newVessel) return;

    // No change
    if (newVessel.name === oldVesselName) return;

    // Assigning to a new vessel
    await updateCrewMember(tenantId, crewMemberId, { assignedVessel: newVessel.name });
    fetchData();
    toast({ title: 'Success', description: `${crewMember.name} assigned to ${newVessel.name}.` });
  };


  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-3 flex flex-col gap-6">
            <Card>
            <CardHeader>
                <CardTitle>Unassigned Crew</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    ref={useDroppable({ id: 'unassigned' }).setNodeRef}
                    className="space-y-3 p-2 rounded-lg bg-muted/50 min-h-[150px]"
                >
                    {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))
                    ) : (
                    unassignedCrew.length > 0 ?
                    unassignedCrew.map(member => (
                        <DraggableCrewMember key={member.id} member={member} />
                    ))
                    : <p className="text-sm text-muted-foreground p-4 text-center">No active crew available.</p>
                    )}
                </div>
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
                    <DroppableVessel
                        key={vessel.id}
                        vessel={vessel}
                        crew={assignedCrewByVessel[vessel.id] || []}
                    />
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
    </DndContext>
  );
}
