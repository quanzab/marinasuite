import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockVessels } from "@/lib/data"

export default function FleetPage() {
  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Fleet Operations</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vessel
          </Button>
        </div>
      </div>
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
              {mockVessels.map((vessel) => (
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Decommission</DropdownMenuItem>
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
