
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';
import { getCrew, getVessels } from '@/lib/firestore';
import type { CrewMember, Vessel } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function CrewManifestReport() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCrew = useCallback(async () => {
    setIsLoading(true);
    try {
      const crewData = await getCrew();
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
  }, [toast]);

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

  return (
    <Card id="crew-manifest" className="print:shadow-none print:border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Crew Manifest</CardTitle>
            <CardDescription>A complete list of all crew members in the database.</CardDescription>
          </div>
          <Button onClick={handlePrint} className="print:hidden">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
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

    const fetchVessels = useCallback(async () => {
        setIsLoading(true);
        try {
            const vesselData = await getVessels();
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
    }, [toast]);

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

    return (
        <Card id="vessel-status-report" className="print:shadow-none print:border-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Vessel Status Report</CardTitle>
                        <CardDescription>An overview of the entire fleet's operational status.</CardDescription>
                    </div>
                    <Button onClick={handlePrint} className="print:hidden">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Report
                    </Button>
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
