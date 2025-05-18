
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Search, Filter, FileText, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

// Mock data
const initialPayments = [
  { id: "P001", customerName: "Alice Wonderland", date: "2024-10-25", amount: "$45.00", status: "Paid", method: "Visa **** 4242", transactionId: "txn_123abc" },
  { id: "P002", customerName: "Bob The Builder", date: "2024-10-26", amount: "$60.00", status: "Paid", method: "MC **** 5555", transactionId: "txn_456def" },
  { id: "P003", customerName: "Charlie Brown", date: "2024-10-27", amount: "$45.00", status: "Pending", method: "Amex **** 1001", transactionId: "txn_789ghi" },
  { id: "P004", customerName: "David Copperfield", date: "2024-10-28", amount: "$75.00", status: "Failed", method: "Discover **** 6011", transactionId: "txn_101jkl" },
  { id: "P005", customerName: "Eve Harrington", date: "2024-10-28", amount: "$45.00", status: "Paid", method: "Visa **** 4242", transactionId: "txn_112mno" },
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPayments = initialPayments.filter(payment =>
    payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className="flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Payment Processing</h1>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" /> Filter Payments
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View and manage all customer payments and transactions.</CardDescription>
                </div>
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={payment.status === "Paid" ? "default" : (payment.status === "Pending" ? "outline" : "destructive")}
                        className={
                            payment.status === "Paid" ? "bg-green-500 text-white" : 
                            (payment.status === "Pending" ? "border-yellow-500 text-yellow-600 bg-yellow-500/10" : "bg-red-500 text-white")
                        }
                      >
                        {payment.status === "Paid" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {payment.status === "Pending" && <Filter className="mr-1 h-3 w-3" />}
                        {payment.status === "Failed" && <XCircle className="mr-1 h-3 w-3" />}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:text-primary">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      {payment.status === "Pending" && (
                        <Button variant="link" size="sm" className="text-green-600 hover:text-green-700">Mark as Paid</Button>
                      )}
                       {payment.status === "Failed" && (
                        <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700">Retry</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
                <CreditCard className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                <p>No payment transactions found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
