
'use client';

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CrewForm, CrewFormValues } from "./crew-form";
import { getCrew, addCrewMember, updateCrewMember, deleteCrewMember } from "@/lib/firestore";
import type { CrewMember } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const { toast } = useToast();

  const fetchCrew = useCallback(async () => {
    setIsLoading(true);
    try {
      const crewData = await getCrew();
      setCrew(crewData);
    } catch (error) {
      console.error("Error fetching crew:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch crew data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCrew();
  }, [fetchCrew]);

  const handleEdit = (crewMember: CrewMember) => {
    setSelectedCrew(crewMember);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCrew(null);
    setIsDialogOpen(true);
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCrewMember(id);
      toast({
        title: "Success",
        description: "Crew member deleted successfully.",
      });
      fetchCrew(); // Refresh data
    } catch (error) {
      console.error("Error deleting crew member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete crew member.",
      });
    }
  };

  const handleFormSubmit = async (data: CrewFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedCrew) {
        // Update existing crew member
        await updateCrewMember(selectedCrew.id, data);
        toast({
          title: "Success",
          description: "Crew member updated successfully.",
        });
      } else {
        // Add new crew member
        await addCrewMember(data);
        toast({
          title: "Success",
          description: "Crew member added successfully.",
        });
      }
      fetchCrew(); // Refresh data
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving crew member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save crew member.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSkeleton = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Crew Management</h1>
        <div className="ml-auto flex items-center gap-2">
           <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Crew Member
          </Button>
        </div>
      </div>

       <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
         if (!isSubmitting) {
           setIsDialogOpen(isOpen);
         }
       }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedCrew ? 'Edit Crew Member' : 'Add Crew Member'}</DialogTitle>
            <DialogDescription>
              {selectedCrew ? 'Update the details of the crew member.' : 'Enter the details for the new crew member.'}
            </DialogDescription>
          </DialogHeader>
          <CrewForm
            crewMember={selectedCrew}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Crew Members</CardTitle>
          <CardDescription>
            Manage your crew members and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Vessel</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? renderSkeleton() : crew.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.rank}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'Active' ? 'default' : member.status === 'On Leave' ? 'outline' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.assignedVessel || 'N/A'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(member)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(member.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
