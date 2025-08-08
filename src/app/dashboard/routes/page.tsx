
'use client';

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { subscribeToRoutes, addRoute, updateRoute, deleteRoute, getVessels } from "@/lib/firestore";
import type { Route, Vessel } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useTenant } from "@/hooks/use-tenant";
import { RouteForm, type RouteFormValues } from "./route-form";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const { toast } = useToast();
  const { user: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const isManagerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const { tenantId } = useTenant();

  const fetchData = useCallback(async (tenantId: string) => {
    setIsLoading(true);
    const unsubscribe = await subscribeToRoutes(tenantId, (routeData) => {
      setRoutes(routeData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching routes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch route data.",
      });
      setIsLoading(false);
    });

    try {
        const vesselData = await getVessels(tenantId);
        setVessels(vesselData);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch vessel data.",
        });
    }

    return unsubscribe;
  }, [toast]);

  useEffect(() => {
    if (tenantId) {
      const unsubscribePromise = fetchData(tenantId);
      return () => {
        unsubscribePromise.then(unsub => unsub());
      };
    }
  }, [tenantId, fetchData]);

  const handleEdit = (item: Route) => {
    setSelectedRoute(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedRoute(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!tenantId) return;
    try {
      await deleteRoute(tenantId, id);
      toast({
        title: "Success",
        description: "Route deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting route:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete route.",
      });
    }
  };

  const handleFormSubmit = async (data: RouteFormValues) => {
    if (!tenantId) return;
    setIsSubmitting(true);
    try {
      if (selectedRoute) {
        await updateRoute(tenantId, selectedRoute.id, data);
        toast({
          title: "Success",
          description: "Route updated successfully.",
        });
      } else {
        await addRoute(tenantId, data);
        toast({
          title: "Success",
          description: "Route added successfully.",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving route:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save route.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderSkeleton = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Route Management</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleAdd} disabled={!isManagerOrAdmin || isUserLoading}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Route
          </Button>
        </div>
      </div>
      
       <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
         if (!isSubmitting) {
           setIsDialogOpen(isOpen);
           if (!isOpen) {
             setSelectedRoute(null);
           }
         }
       }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
            <DialogDescription>
              {selectedRoute ? 'Update the details for this shipping route.' : 'Enter the details for the new route.'}
            </DialogDescription>
          </DialogHeader>
          <RouteForm
            route={selectedRoute}
            vessels={vessels}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>


      <Card>
        <CardHeader>
          <CardTitle>Shipping Routes</CardTitle>
          <CardDescription>
            Manage all active and planned shipping routes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Port</TableHead>
                <TableHead>End Port</TableHead>
                <TableHead>Assigned Vessel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? renderSkeleton() : routes.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.startPort}</TableCell>
                  <TableCell>{item.endPort}</TableCell>
                  <TableCell>{item.vessel}</TableCell>
                   <TableCell>
                    <Badge variant={item.status === 'Open' ? 'outline' : item.status === 'In Progress' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(item)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
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
            {routes.length === 0 && !isLoading && (
                <div className="text-center py-10 text-muted-foreground">
                    No routes found. Add one to get started.
                </div>
            )}
        </CardContent>
      </Card>
    </>
  )
}
