
'use client';

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VesselForm, VesselFormValues } from "./vessel-form";
import { ScheduleMaintenanceForm } from "./schedule-maintenance-form";
import { getVessels, addVessel, updateVessel, deleteVessel } from "@/lib/firestore";
import type { Vessel, ScheduleMaintenanceFormValues } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function FleetPage() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVesselFormOpen, setIsVesselFormOpen] = useState(false);
  const [isMaintenanceFormOpen, setIsMaintenanceFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchVessels = useCallback(async () => {
    setIsLoading(true);
    try {
      const vesselData = await getVessels();
      setVessels(vesselData);
    } catch (error) {
      console.error("Error fetching vessels:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch vessel data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVessels();
  }, [fetchVessels]);

  const handleEdit = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setIsVesselFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedVessel(null);
    setIsVesselFormOpen(true);
  }

  const handleScheduleMaintenance = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setIsMaintenanceFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVessel(id);
      toast({
        title: "Success",
        description: "Vessel decommissioned successfully.",
      });
      fetchVessels();
    } catch (error) {
      console.error("Error deleting vessel:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to decommission vessel.",
      });
    }
  };

  const handleVesselFormSubmit = async (data: VesselFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedVessel) {
        await updateVessel(selectedVessel.id, data);
        toast({
          title: "Success",
          description: "Vessel updated successfully.",
        });
      } else {
        await addVessel(data);
        toast({
          title: "Success",
          description: "Vessel added successfully.",
        });
      }
      fetchVessels();
      setIsVesselFormOpen(false);
    } catch (error) {
      console.error("Error saving vessel:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save vessel.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaintenanceFormSubmit = async (data: ScheduleMaintenanceFormValues) => {
    if (!selectedVessel) return;
    setIsSubmitting(true);
    try {
      await updateVessel(selectedVessel.id, {
        nextMaintenance: data.nextMaintenance,
        status: "In Maintenance",
      });
      toast({
        title: "Success",
        description: `Maintenance scheduled for ${selectedVessel.name}.`,
      });
      fetchVessels();
      setIsMaintenanceFormOpen(false);
    } catch (error) {
      console.error("Error scheduling maintenance:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule maintenance.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/fleet/${id}`);
  };

  const renderSkeleton = () => (
    Array.from({ length: 4 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Fleet Operations</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vessel
          </Button>
        </div>
      </div>

       <Dialog open={isVesselFormOpen} onOpenChange={(isOpen) => {
         if (!isSubmitting) setIsVesselFormOpen(isOpen);
       }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedVessel ? 'Edit Vessel' : 'Add Vessel'}</DialogTitle>
            <DialogDescription>
              {selectedVessel ? 'Update the details of the vessel.' : 'Enter the details for the new vessel.'}
            </DialogDescription>
          </DialogHeader>
          <VesselForm
            vessel={selectedVessel}
            onSubmit={handleVesselFormSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
       <Dialog open={isMaintenanceFormOpen} onOpenChange={(isOpen) => {
         if (!isSubmitting) setIsMaintenanceFormOpen(isOpen);
       }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>
              Set the next maintenance date for "{selectedVessel?.name}". The status will be updated to "In Maintenance".
            </DialogDescription>
          </DialogHeader>
          <ScheduleMaintenanceForm
            vessel={selectedVessel}
            onSubmit={handleMaintenanceFormSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Vessels</CardTitle>
          <CardDescription>
            Manage your fleet and view vessel details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>IMO</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Maintenance</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? renderSkeleton() : vessels.map((vessel) => (
                <TableRow key={vessel.id}>
                  <TableCell className="font-medium">{vessel.name}</TableCell>
                  <TableCell>{vessel.imo}</TableCell>
                  <TableCell>{vessel.type}</TableCell>
                  <TableCell>
                    <Badge variant={vessel.status === 'In Service' ? 'default' : vessel.status === 'In Maintenance' ? 'outline' : 'secondary'}>
                      {vessel.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{vessel.nextMaintenance}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(vessel)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(vessel.id)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleScheduleMaintenance(vessel)}>Schedule Maintenance</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(vessel.id)}
                        >
                          Decommission
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
