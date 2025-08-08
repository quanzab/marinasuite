import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockCrew } from "@/lib/data"

export default function CrewPage() {
  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Crew Management</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Crew Member
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Crew Members</CardTitle>
          <CardDescription>
            Manage your crew members and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Vessel</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCrew.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.rank}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'Active' ? 'default' : member.status === 'On Leave' ? 'outline' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.assignedVessel || 'N/A'}</TableCell>
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
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
