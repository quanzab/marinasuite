import Link from "next/link"
import {
  ArrowUpRight,
  Ship,
  Users,
  FileWarning,
} from "lucide-react"

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

import { mockCrew, mockVessels } from "@/lib/data"

export default function Dashboard() {
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
            <div className="text-2xl font-bold">{mockCrew.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 active this month
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
            <div className="text-2xl font-bold">{mockVessels.filter(v => v.status === 'In Service').length}</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Expiring</CardTitle>
            <FileWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
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
              <CardTitle>Active Crew Members</CardTitle>
              <CardDescription>
                Overview of recently active crew members.
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
                {mockCrew.slice(0, 5).map((crew) => (
                    <TableRow key={crew.id}>
                        <TableCell>
                            <div className="font-medium">{crew.name}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                {crew.rank}
                            </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                            {crew.rank}
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                            <Badge className="text-xs" variant={crew.status === 'Active' ? 'outline' : 'secondary'}>
                                {crew.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">{crew.assignedVessel || "N/A"}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>
              Live status of all vessels in the fleet.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            {mockVessels.map(vessel => (
              <div key={vessel.id} className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {vessel.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    IMO: {vessel.imo}
                  </p>
                </div>
                <div className={`ml-auto font-medium ${vessel.status === 'In Service' ? 'text-green-500' : vessel.status === 'In Maintenance' ? 'text-amber-500' : 'text-red-500'}`}>{vessel.status}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
