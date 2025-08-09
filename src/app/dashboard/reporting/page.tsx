
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, Download } from 'lucide-react';
import { getCrew, getVessels, getCertificates } from '@/lib/firestore';
import type { Certificate, CertificateWithStatus, CrewMember, Vessel } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/hooks/use-tenant';
import Papa from 'papaparse';

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


function downloadCSV(data: any[], filename: string) {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


function CrewManifestReport() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { tenantId } = useTenant();

  const fetchCrew = useCallback(async () => {
    if (!tenantId) return;
    setIsLoading(true);
    try {
      const crewData = await getCrew(tenantId);
      setCrew(crewData);
    } catch (error) {
      console.error('Error fetching crew data for report:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch data for crew manifest.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, tenantId]);

  useEffect(() => {
    fetchCrew();
  }, [fetchCrew]);

  const handlePrint = () => {
    const printContents = document.getElementById('crew-manifest')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const handleExport = () => {
    const dataToExport = crew.map(c => ({
        id: c.id,
        name: c.name,
        rank: c.rank,
        status: c.status,
        assignedVessel: c.assignedVessel || 'N/A',
        certifications: c.certifications?.join(', ') || '',
    }));
    downloadCSV(dataToExport, 'crew_manifest.csv');
  };

  return (
    <Card id="crew-manifest" className="print:shadow-none print:border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Crew Manifest</CardTitle>
            <CardDescription>A complete list of all crew members in the database.</CardDescription>
          </div>
           <div className="flex gap-2 print:hidden">
            <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
            <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Vessel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crew.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-mono text-xs">{member.id.substring(0, 8)}...</TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.rank}</TableCell>
                  <TableCell>{member.status}</TableCell>
                  <TableCell>{member.assignedVessel || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {crew.length === 0 && !isLoading && (
          <div className="text-center py-10 text-muted-foreground">
            No crew members found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VesselStatusReport() {
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { tenantId } = useTenant();

    const fetchVessels = useCallback(async () => {
        if (!tenantId) return;
        setIsLoading(true);
        try {
            const vesselData = await getVessels(tenantId);
            setVessels(vesselData);
        } catch (error) {
            console.error('Error fetching vessel data for report:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to fetch data for vessel status report.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast, tenantId]);

    useEffect(() => {
        fetchVessels();
    }, [fetchVessels]);

    const handlePrint = () => {
        const printContents = document.getElementById('vessel-status-report')?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
    };
    
    const handleExport = () => {
        const dataToExport = vessels.map(v => ({
            id: v.id,
            name: v.name,
            imo: v.imo,
            type: v.type,
            status: v.status,
            nextMaintenance: v.nextMaintenance,
        }));
        downloadCSV(dataToExport, 'vessel_status_report.csv');
    };

    return (
        <Card id="vessel-status-report" className="print:shadow-none print:border-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Vessel Status Report</CardTitle>
                        <CardDescription>An overview of the entire fleet's operational status.</CardDescription>
                    </div>
                     <div className="flex gap-2 print:hidden">
                        <Button onClick={handleExport} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                        <Button onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Report
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>IMO</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Next Maintenance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vessels.map((vessel) => (
                                <TableRow key={vessel.id}>
                                    <TableCell className="font-mono text-xs">{vessel.imo}</TableCell>
                                    <TableCell className="font-medium">{vessel.name}</TableCell>
                                    <TableCell>{vessel.type}</TableCell>
                                    <TableCell>{vessel.status}</TableCell>
                                    <TableCell>{vessel.nextMaintenance}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {vessels.length === 0 && !isLoading && (
                    <div className="text-center py-10 text-muted-foreground">
                        No vessels found.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function CertificateStatusReport() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { tenantId } = useTenant();

    const fetchCertificates = useCallback(async () => {
        if (!tenantId) return;
        setIsLoading(true);
        try {
            const certificateData = await getCertificates(tenantId);
            setCertificates(certificateData);
        } catch (error) {
            console.error('Error fetching certificate data for report:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to fetch data for certificate status report.',
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


    const handlePrint = () => {
        const printContents = document.getElementById('certificate-status-report')?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
    };
    
    const handleExport = () => {
        const dataToExport = certificatesWithStatus.map(c => ({
            id: c.id,
            name: c.name,
            issuedBy: c.issuedBy,
            issueDate: c.issueDate,
            expiryDate: c.expiryDate,
            status: c.status,
            daysUntilExpiry: c.daysUntilExpiry,
        }));
        downloadCSV(dataToExport, 'certificate_status_report.csv');
    };


    return (
        <Card id="certificate-status-report" className="print:shadow-none print:border-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Certificate Status Report</CardTitle>
                        <CardDescription>An overview of all certificates and their validity.</CardDescription>
                    </div>
                     <div className="flex gap-2 print:hidden">
                        <Button onClick={handleExport} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                        <Button onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Report
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Certificate Name</TableHead>
                                <TableHead>Issued By</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expires In</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificatesWithStatus.map((cert) => (
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {certificates.length === 0 && !isLoading && (
                    <div className="text-center py-10 text-muted-foreground">
                        No certificates found.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}



export default function ReportingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Reporting</h1>
      </div>
      <p className="text-muted-foreground print:hidden">
        Generate and view reports for your maritime operations.
      </p>

      <div className="grid gap-6">
        <CrewManifestReport />
        <VesselStatusReport />
        <CertificateStatusReport />
      </div>

      <style jsx global>{`
        @media print {
          body > * {
            display: none !important;
          }
          body {
            background-color: white !important;
          }
          .printable-report {
            display: block !important;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
          }
          .print-only {
             display: block !important;
          }
           .print:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
