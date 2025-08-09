
'use client';

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getUsers, addUser, updateUser, deleteUser } from "@/lib/firestore";
import type { User } from "@/lib/types";
import { UserForm } from "./user-form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { UserFormValues } from "@/lib/types";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { user: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const isAdmin = currentUser?.role === 'Admin';


  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await getUsers();
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (!isAdmin) return;
    try {
      await deleteUser(user.id, user.tenant);
      toast({
        title: "Success",
        description: "User removed successfully.",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error removing user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove user.",
      });
    }
  };

  const handleFormSubmit = async (data: UserFormValues) => {
    if (!isAdmin) return;
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        await updateUser(selectedUser.tenant, selectedUser.id, data);
        toast({
          title: "Success",
          description: "User updated successfully.",
        });
      } else {
        await addUser(data);
        toast({
          title: "Success",
          description: "User invited successfully.",
        });
      }
      fetchUsers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save user details.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderSkeleton = () => (
    Array.from({ length: 4 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Admin Panel</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleAdd} disabled={!isAdmin || isUserLoading}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>
      </div>

       <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
         if (!isSubmitting) {
           setIsDialogOpen(isOpen);
           if (!isOpen) {
             setSelectedUser(null);
           }
         }
       }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Invite User'}</DialogTitle>
            <DialogDescription>
              {selectedUser ? 'Update the details for this user.' : 'Enter the details for the new user.'}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={selectedUser}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            isAdmin={isAdmin}
          />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users, roles, and permissions across tenants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? renderSkeleton() : users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'destructive' : user.role === 'Manager' ? 'default' : 'outline'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.tenant}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!isAdmin || isUserLoading}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(user)}>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem disabled>Change Tenant</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(user)}
                        >
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {users.length === 0 && !isLoading && (
              <div className="text-center py-10 text-muted-foreground">
                No users found.
              </div>
            )}
        </CardContent>
      </Card>
    </>
  )
}
