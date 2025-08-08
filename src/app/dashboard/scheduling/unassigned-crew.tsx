
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CrewMember } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";


const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}


interface UnassignedCrewProps {
    crew: CrewMember[];
    onAssign: (member: CrewMember) => void;
    isLoading: boolean;
    isManagerOrAdmin: boolean;
}

export function UnassignedCrew({ crew, onAssign, isLoading, isManagerOrAdmin }: UnassignedCrewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Unassigned Crew (Direct Assign)</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[25vh] overflow-y-auto">
                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full mb-2" />
                    ))
                ) : (
                    <div className="space-y-2">
                        {crew.length > 0 ? (
                            crew.map(member => (
                                <div key={member.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                                        <AvatarFallback>{getAvatarFallback(member.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{member.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.rank}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onAssign(member)}
                                        disabled={!isManagerOrAdmin}
                                    >
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Assign
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground p-4 text-center">No active crew available.</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
