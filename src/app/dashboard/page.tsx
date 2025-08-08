
'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link"
import {
  ArrowUpRight,
  Ship,
  Users,
  FileWarning,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip } from 'recharts';


import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCrew, getVessels } from "@/lib/firestore"
import type { CrewMember, Vessel } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";


export default function Dashboard() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [crewData, vesselData] = await Promise.all([getCrew(), getVessels()]);
      setCrew(crewData);
      setVessels(vesselData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch dashboard data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const vesselsInService = vessels.filter(v => v.status === 'In Service').length;

  const vesselStatusData = useMemo(() => {
    const statusCounts = vessels.reduce((acc, vessel) => {
      acc[vessel.status] = (acc[vessel.status] || 0) + 1;
      return acc;
    }, {} as Record<Vessel['status'], number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [vessels]);

  const crewStatusData = useMemo(() => {
    const statusCounts = crew.reduce((acc, member) => {
        acc[member.status] = (acc[member.status] || 0) + 1;
        return acc;
    }, {} as Record<CrewMember['status'], number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
    }));
  }, [crew]);


  const chartConfig = {
    count: {
      label: "Vessels",
    },
    "In Service": {
      label: "In Service",
      color: "hsl(var(--chart-2))",
    },
    "In Maintenance": {
      label: "In Maintenance",
      color: "hsl(var(--chart-4))",
    },
    "Docked": {
      label: "Docked",
      color: "hsl(var(--chart-5))",
    },
     "Active": {
      label: "Active",
      color: "hsl(var(--chart-2))",
    },
    "On Leave": {
      label: "On Leave",
      color: "hsl(var(--chart-4))",
    },
    "Inactive": {
      label: "Inactive",
      color: "hsl(var(--chart-5))",
    },
  };

  return (
    <>
       <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Crew
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{crew.length}</div>}
            <p className="text-xs text-muted-foreground">
              Across all tenants
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vessels In Service
            </CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{vesselsInService}</div>}
            <p className="text-xs text-muted-foreground">
              out of {vessels.length} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Expiring</CardTitle>
            <FileWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* This data is still mock until certs are linked to crew/vessels */}
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Within the next 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Routes</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {/* This data is still mock */}
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                    Awaiting crew allocation
                </p>
            </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Crew Members</CardTitle>
              <CardDescription>
                Most recently added crew members.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/crew">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Rank
                  </TableHead>
                  <TableHead className="hidden xl:table-column">
                    Status
                  </TableHead>
                  <TableHead className="text-right">Assigned Vessel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden xl:table-column"><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="hidden xl:table-column"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  crew.slice(0, 5).map((member) => (
                    <TableRow key={member.id}>
                        <TableCell>
                            <div className="font-medium">{member.name}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                {member.rank}
                            </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                            {member.rank}
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                            <Badge className="text-xs" variant={member.status === 'Active' ? 'default' : 'outline'}>
                                {member.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">{member.assignedVessel || "N/A"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="grid gap-4 auto-rows-min xl:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Crew Status Distribution</CardTitle>
                    <CardDescription>Breakdown of crew by current status.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                      <Skeleton className="w-full h-full" />
                    </div>
                  ) : (
                    <ChartContainer config={chartConfig} className="w-full h-[200px]">
                        <BarChart
                            data={crewStatusData}
                            layout="vertical"
                            margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                            accessibilityLayer
                        >
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="status"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey="count" layout="vertical" radius={5}>
                                {crewStatusData.map((entry) => (
                                    <Cell key={entry.status} fill={chartConfig[entry.status as keyof typeof chartConfig]?.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                  )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Vessel Distribution</CardTitle>
                    <CardDescription>Breakdown of vessels by operational status.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                      <Skeleton className="w-40 h-40 rounded-full" />
                    </div>
                  ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={vesselStatusData}
                                dataKey="count"
                                nameKey="status"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                {vesselStatusData.map((entry) => (
                                    <Cell key={entry.status} fill={chartConfig[entry.status as keyof typeof chartConfig]?.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                  )}
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  )
}

    