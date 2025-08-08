
'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { differenceInDays } from 'date-fns';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CertificateForm, CertificateFormValues } from "./certificate-form";
import { RenewCertificateForm } from "./renew-form";
import { getCertificates, addCertificate, updateCertificate, deleteCertificate } from "@/lib/firestore";
import type { Certificate, CertificateWithStatus, RenewCertificateFormValues } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useTenant } from "@/hooks/use-tenant";

function getCertificateStatus(expiryDate: string): { status: 'Valid' | 'Expiring Soon' | 'Expired', daysUntilExpiry: number } {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = differenceInDays(expiry, today);

  if (daysUntilExpiry < 0) {
    return { status: 'Expired', daysUntilExpiry };
  }
  if (daysUntilExpiry <= 30) {
    return { status: 'Expiring Soon', daysUntilExpiry };
  }
  return { status: 'Valid', daysUntilExpiry };
}


export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const { toast } = useToast();
  const { user: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const isManagerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  const { tenantId } = useTenant();


  const fetchCertificates = useCallback(async () => {
    if (!tenantId) return;
    setIsLoading(true);
    try {
      const certificateData = await getCertificates(tenantId);
      setCertificates(certificateData);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch certificate data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, tenantId]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const certificatesWithStatus: CertificateWithStatus[] = useMemo(() => {
    return certificates.map(cert => {
      const { status, daysUntilExpiry } = getCertificateStatus(cert.expiryDate);
      return { ...cert, status, daysUntilExpiry };
    });
  }, [certificates]);

  const handleEdit = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsFormDialogOpen(true);
  };
  
  const handleRenew = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsRenewDialogOpen(true);
  };


  const handleAdd = () => {
    setSelectedCertificate(null);
    setIsFormDialogOpen(true);
  }

  const handleDelete = async (id: string) => {
    if (!tenantId) return;
    try {
      await deleteCertificate(tenantId, id);
      toast({
        title: "Success",
        description: "Certificate deleted successfully.",
      });
      fetchCertificates();
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete certificate.",
      });
    }
  };

  const handleFormSubmit = async (data: CertificateFormValues) => {
    if (!tenantId) return;
    setIsSubmitting(true);
    try {
      if (selectedCertificate) {
        await updateCertificate(tenantId, selectedCertificate.id, data);
        toast({
          title: "Success",
          description: "Certificate updated successfully.",
        });
      } else {
        await addCertificate(tenantId, data);
        toast({
          title: "Success",
          description: "Certificate added successfully.",
        });
      }
      fetchCertificates();
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save certificate.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRenewSubmit = async (data: RenewCertificateFormValues) => {
    if (!selectedCertificate || !tenantId) return;
    setIsSubmitting(true);
    try {
      await updateCertificate(tenantId, selectedCertificate.id, {
        issueDate: new Date(),
        expiryDate: data.expiryDate
      });
      toast({
        title: "Success",
        description: "Certificate renewed successfully.",
      });
      fetchCertificates();
      setIsRenewDialogOpen(false);
    } catch (error) {
      console.error("Error renewing certificate:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to renew certificate.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderSkeleton = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Certificate Management</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleAdd} disabled={!isManagerOrAdmin || isUserLoading}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
        </div>
      </div>
      
       <Dialog open={isFormDialogOpen} onOpenChange={(isOpen) => {
         if (!isSubmitting) setIsFormDialogOpen(isOpen);
       }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedCertificate ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
            <DialogDescription>
              {selectedCertificate ? 'Update the details of the certificate.' : 'Enter the details for the new certificate.'}
            </DialogDescription>
          </DialogHeader>
          <CertificateForm
            certificate={selectedCertificate}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isRenewDialogOpen} onOpenChange={(isOpen) => {
         if (!isSubmitting) setIsRenewDialogOpen(isOpen);
       }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Renew Certificate</DialogTitle>
            <DialogDescription>
              Renewing "{selectedCertificate?.name}". Set the new expiry date.
            </DialogDescription>
          </DialogHeader>
          <RenewCertificateForm
            onSubmit={handleRenewSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>


      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
          <CardDescription>
            Manage and track all crew and vessel certificates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate Name</TableHead>
                <TableHead>Issued By</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires In</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? renderSkeleton() : certificatesWithStatus.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.name}</TableCell>
                  <TableCell>{cert.issuedBy}</TableCell>
                  <TableCell>{cert.expiryDate}</TableCell>
                  <TableCell>
                    <Badge variant={cert.status === 'Valid' ? 'default' : cert.status === 'Expiring Soon' ? 'outline' : 'destructive'}>
                      {cert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{cert.daysUntilExpiry > 0 ? `${cert.daysUntilExpiry} days` : 'Expired'}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(cert)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRenew(cert)}>Renew</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(cert.id)}
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
