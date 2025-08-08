
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, Loader2 } from 'lucide-react';
import { getCrew } from '@/lib/firestore';
import type { CrewMember } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportingPage() {
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
    window.print();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Reporting</h1>
      </div>
      <p className="text-muted-foreground">
        Generate and view reports for your maritime operations.
      </p>

      <Card className="print:shadow-none print:border-none">
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
      
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
          }
          main {
            padding: 0 !important;
            margin: 1rem !important;
          }
          header, .md\:block, .print\:hidden {
            display: none !important;
          }
          .print\:shadow-none {
            box-shadow: none !important;
          }
          .print\:border-none {
            border: none !important;
          }
          h1, p, .print\:block {
             display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
