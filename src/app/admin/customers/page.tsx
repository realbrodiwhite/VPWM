
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit3, Trash2, Users, Search, FileDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data
const initialCustomers = [
  { id: "C001", name: "Alice Wonderland", email: "alice@example.com", phone: "555-0101", address: "123 Rabbit Hole Ln", servicePlan: "Weekly Cleanup", status: "Active", joinDate: "2023-05-15" },
  { id: "C002", name: "Bob The Builder", email: "bob@example.com", phone: "555-0102", address: "456 Construction Rd", servicePlan: "Bi-Weekly Cleanup", status: "Active", joinDate: "2023-06-20" },
  { id: "C003", name: "Charlie Brown", email: "charlie@example.com", phone: "555-0103", address: "789 Kite Flying Park", servicePlan: "Weekly Cleanup", status: "Paused", joinDate: "2023-07-01" },
  { id: "C004", name: "Diana Prince", email: "diana@example.com", phone: "555-0104", address: "1 Themyscira Way", servicePlan: "One-Time (Large)", status: "Inactive", joinDate: "2024-01-10" },
];

export default function ManageCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCustomers = initialCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Customer Management</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-1/2 sm:w-auto">
                <FileDown className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-1/2 sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
            </Button>
        </div>
      </div>
        
      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>View, edit, and manage customer accounts.</CardDescription>
                </div>
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search customers..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Service Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.servicePlan}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "Active" ? "default" : (customer.status === "Paused" ? "outline" : "secondary")}
                        className={customer.status === "Active" ? "bg-green-500 text-white" : (customer.status === "Paused" ? "border-yellow-500 text-yellow-600" : "")}
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:text-primary mr-1">
                        <Edit3 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center py-12 text-muted-foreground">
                <Users className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                <p>No customers found matching your search criteria.</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
