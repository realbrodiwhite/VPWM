
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, PlusCircle, Edit } from "lucide-react";

// Mock data
const paymentMethods = [
  { id: "pm_1", type: "Visa", last4: "4242", expiry: "12/25", isDefault: true },
  { id: "pm_2", type: "Mastercard", last4: "5555", expiry: "08/26", isDefault: false },
];

const invoices = [
  { id: "INV001", date: "October 1, 2024", amount: "$45.00", status: "Paid", servicePeriod: "October 2024" },
  { id: "INV002", date: "September 1, 2024", amount: "$45.00", status: "Paid", servicePeriod: "September 2024" },
  { id: "INV003", date: "August 1, 2024", amount: "$60.00", status: "Paid", servicePeriod: "August 2024 (incl. one-time)" },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <CreditCard className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Billing & Payments</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods.</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethods.map((method) => (
            <Card key={method.id} className="mb-4 p-4 flex justify-between items-center hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold">{method.type} ending in {method.last4}</p>
                  <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault && <Badge variant="default" className="bg-accent text-accent-foreground">Default</Badge>}
                <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-1 md:mr-2"/> Edit</Button>
                 {!method.isDefault && <Button variant="ghost" size="sm" className="text-primary">Set as Default</Button>}
              </div>
            </Card>
          ))}
        </CardContent>
        <CardFooter>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Payment Method
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>View and download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Service Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.servicePeriod}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === "Paid" ? "default" : "destructive"}
                        className={invoice.status === "Paid" ? "bg-green-500 text-white" : ""}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon" className="hover:text-primary">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download Invoice</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No invoices available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
