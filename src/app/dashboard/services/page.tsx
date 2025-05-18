
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit3, Trash2, CalendarPlus } from "lucide-react";
import Link from "next/link";

// Mock data
const services = [
  { id: "S001", serviceType: "Weekly Cleanup", nextServiceDate: "October 28, 2024", status: "Active", price: "$45/mo" },
  { id: "S002", serviceType: "Yard Deodorizing", nextServiceDate: "October 28, 2024", status: "Active", price: "$10/mo (Add-on)" },
  { id: "S003", serviceType: "One-Time Cleanup", nextServiceDate: "August 15, 2024", status: "Completed", price: "$75" },
];

export default function MyServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">My Services</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/dashboard/book">
            <CalendarPlus className="mr-2 h-4 w-4" /> Book New Service
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Current & Past Services</CardTitle>
          <CardDescription>Manage your scheduled pet waste removal services.</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Next Service / Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{service.id}</TableCell>
                    <TableCell>{service.serviceType}</TableCell>
                    <TableCell>{service.nextServiceDate}</TableCell>
                    <TableCell>
                      <Badge variant={service.status === "Active" ? "default" : "secondary"}
                       className={service.status === "Active" ? "bg-green-500 text-white" : ""}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{service.price}</TableCell>
                    <TableCell className="text-right">
                      {service.status === "Active" && (
                        <>
                          <Button variant="ghost" size="icon" className="hover:text-primary mr-1">
                            <Edit3 className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Cancel</span>
                          </Button>
                        </>
                      )}
                      {service.status !== "Active" && (
                         <Button variant="link" size="sm" asChild className="text-primary">
                            <Link href="/dashboard/book">Re-Book</Link>
                         </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarPlus className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="mb-2">You have no services scheduled yet.</p>
              <Button asChild>
                <Link href="/dashboard/book">Book Your First Service</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
