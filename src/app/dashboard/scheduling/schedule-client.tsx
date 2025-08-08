
'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CrewMember, Vessel } from "@/lib/types";
import { getCrew, getVessels, updateCrewMember } from "@/lib/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GripVertical, Ship } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useTenant } from "@/hooks/use-tenant";
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function DraggableCrewMember({ member }: { member: CrewMember }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: member.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
        opacity: isDragging ? 0.7 : 1,
    };

    return (
        <Card ref={setNodeRef} style={style} className="p-3 bg-card touch-none">
            <div className="flex items-center justify-between">
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
                <button {...attributes} {...listeners} className="p-1 text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                </button>
            </div>
        </Card>
    );
}

function DroppableVessel({ vessel, crew, children }: { vessel: Vessel; crew: CrewMember[]; children?: React.ReactNode }) {
    const { setNodeRef, isOver } = useSortable({ id: vessel.id, data: { accepts: 'crewMember' } });
    
    return (
        <div ref={setNodeRef} className="space-y-2">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Ship className="w-4 h-4 text-primary" />
                {vessel.name}
            </h4>
            <div className={`p-2 rounded-lg bg-muted/50 min-h-[60px] transition-colors ${isOver ? 'bg-primary/20 ring-2 ring-primary' : ''}`}>
                {crew.length > 0 ? (
                    crew.map(member => (
                        <div key={member.id} className="text-xs p-1 bg-card rounded my-1 shadow-sm">
                           {member.name} - <span className="text-muted-foreground">{member.rank}</span>
                       </div>
                    ))
                ) : (
                    <p className="text-xs text-muted-foreground p-2 text-center">Drag crew here</p>
                )}
                {children}
            </div>
        </div>
    );
}


export default function ScheduleClient() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const isManagerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const { tenantId } = useTenant();

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));

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
  const unassignedCrewIds = useMemo(() => unassignedCrew.map(c => c.id), [unassignedCrew]);


  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !isManagerOrAdmin || !tenantId) return;

    const crewMemberId = active.id as string;
    const targetVesselId = over.id as string;

    const crewMember = crew.find(c => c.id === crewMemberId);
    const targetVessel = vessels.find(v => v.id === targetVesselId);

    if (crewMember && targetVessel && crewMember.assignedVessel !== targetVessel.name) {
       try {
            // Optimistic update
            setCrew(prevCrew => prevCrew.map(c => c.id === crewMemberId ? { ...c, assignedVessel: targetVessel.name } : c));

            await updateCrewMember(tenantId, crewMember.id, { assignedVessel: targetVessel.name });
            toast({
                title: 'Success',
                description: `${crewMember.name} assigned to ${targetVessel.name}.`,
            });
            fetchData(); // Re-sync with database
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to assign crew member.',
            });
            // Revert optimistic update on failure
            setCrew(prevCrew => prevCrew.map(c => c.id === crewMemberId ? { ...c, assignedVessel: crewMember.assignedVessel } : c));
        }
    }
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
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full mb-3" />
              ))
            ) : (
              <SortableContext items={unassignedCrewIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                    {unassignedCrew.length > 0 ? (
                    unassignedCrew.map(member => (
                        <DraggableCrewMember key={member.id} member={member} />
                    ))
                    ) : (
                    <p className="text-sm text-muted-foreground p-4 text-center">No active crew available.</p>
                    )}
                </div>
              </SortableContext>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-9">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
             {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i}>
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                ))
                ) : (
                vessels.map(vessel => (
                    <SortableContext key={vessel.id} items={[]} strategy={verticalListSortingStrategy}>
                        <DroppableVessel vessel={vessel} crew={assignedCrewByVessel[vessel.id] || []} />
                    </SortableContext>
                ))
            )}
        </div>
      </div>
    </div>
    </DndContext>
  );
}
