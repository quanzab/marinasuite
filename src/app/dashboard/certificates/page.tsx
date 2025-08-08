import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockCertificates } from "@/lib/data"

export default function CertificatesPage() {
  return (
    <>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Certificate Management</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
        </div>
      </div>
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
              {mockCertificates.map((cert) => (
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
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Renew</DropdownMenuItem>
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
