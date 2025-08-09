
'use client';

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, PlusCircle, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CrewForm, CrewFormValues } from "./crew-form";
import { subscribeToCrew, addCrewMember, updateCrewMember, deleteCrewMember, addMultipleCrewMembers } from "@/lib/firestore";
import type { CrewMember } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useTenant } from "@/hooks/use-tenant";
import Papa from 'papaparse';


export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { user: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const isManagerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const { tenantId } = useTenant();


  const fetchCrew = useCallback(async (tenantId: string) => {
    setIsLoading(true);
    const unsubscribe = await subscribeToCrew(tenantId, (crewData) => {
      setCrew(crewData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching crew:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch crew data.",
      });
      setIsLoading(false);
    });
    return unsubscribe;
  }, [toast]);

  useEffect(() => {
    if (tenantId) {
      const unsubscribePromise = fetchCrew(tenantId);
      return () => {
        unsubscribePromise.then(unsub => unsub());
      };
    }
  }, [tenantId, fetchCrew]);

  const handleEdit = (crewMember: CrewMember) => {
    setSelectedCrew(crewMember);
    setIsFormDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCrew(null);
    setIsFormDialogOpen(true);
  }

  const handleDelete = async (id: string) => {
    if (!tenantId) return;
    try {
      await deleteCrewMember(tenantId, id);
      toast({
        title: "Success",
        description: "Crew member deleted successfully.",
      });
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
    if (!tenantId) return;
    setIsSubmitting(true);
    try {
      if (selectedCrew) {
        // Update existing crew member
        await updateCrewMember(tenantId, selectedCrew.id, data);
        toast({
          title: "Success",
          description: "Crew member updated successfully.",
        });
      } else {
        // Add new crew member
        await addCrewMember(tenantId, data);
        toast({
          title: "Success",
          description: "Crew member added successfully.",
        });
      }
      setIsFormDialogOpen(false);
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
  
  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/crew/${id}`);
  };

  const handleImportCSV = (file: File) => {
    if (!tenantId) return;
    setIsSubmitting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const requiredFields = ['name', 'rank', 'status'];
        const headers = results.meta.fields;
        
        if (!headers || !requiredFields.every(field => headers.includes(field))) {
          toast({
            variant: "destructive",
            title: "Import Error",
            description: `CSV must include the following headers: ${requiredFields.join(', ')}.`,
            duration: 5000,
          });
          setIsSubmitting(false);
          return;
        }

        const newCrewMembers = results.data as CrewFormValues[];
        
        try {
          await addMultipleCrewMembers(tenantId, newCrewMembers);
          toast({
            title: "Import Successful",
            description: `${newCrewMembers.length} crew members have been imported.`,
          });
          setIsImportDialogOpen(false);
        } catch (error) {
          console.error("Error importing crew members:", error);
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: "An error occurred while importing the data.",
          });
        } finally {
          setIsSubmitting(false);
        }
      },
      error: (error: any) => {
        toast({
          variant: "destructive",
          title: "Parsing Error",
          description: `Failed to parse CSV file: ${error.message}`,
        });
        setIsSubmitting(false);
      }
    });
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
            <Button onClick={() => setIsImportDialogOpen(true)} variant="outline" disabled={!isManagerOrAdmin || isUserLoading}>
                <Upload className="mr-2 h-4 w-4" />
                Import from CSV
            </Button>
           <Button onClick={handleAdd} disabled={!isManagerOrAdmin || isUserLoading}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Crew Member
          </Button>
        </div>
      </div>

       <Dialog open={isFormDialogOpen} onOpenChange={(isOpen) => {
         if (!isSubmitting) {
           setIsFormDialogOpen(isOpen);
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
      
      <Dialog open={isImportDialogOpen} onOpenChange={(isOpen) => {
          if (!isSubmitting) setIsImportDialogOpen(isOpen);
      }}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Import Crew from CSV</DialogTitle>
                  <DialogDescription>
                      Upload a CSV file with the headers: `name`, `rank`, and `status`. Each row will create a new crew member.
                  </DialogDescription>
              </DialogHeader>
              <div>
                  <label htmlFor="csv-upload" className="block text-sm font-medium text-gray-700 mb-2">
                      CSV File
                  </label>
                  <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                              handleImportCSV(e.target.files[0]);
                          }
                      }}
                      disabled={isSubmitting}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                      Note: `status` must be 'Active', 'On Leave', or 'Inactive'.
                  </p>
              </div>
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
                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!isManagerOrAdmin || isUserLoading}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(member)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(member.id)}>View Details</DropdownMenuItem>
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
