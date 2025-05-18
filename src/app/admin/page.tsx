
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CalendarCheck, DollarSign, Route as RouteIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock data for charts
const dailyServiceData = [
  { date: "Mon", services: 12 }, { date: "Tue", services: 15 }, { date: "Wed", services: 10 },
  { date: "Thu", services: 18 }, { date: "Fri", services: 22 }, { date: "Sat", services: 8 }, {date: "Sun", services: 0}
];

const revenueData = [
  { month: "Jul", revenue: 1200 }, { month: "Aug", revenue: 1500 }, { month: "Sep", revenue: 1350 },
  { month: "Oct", revenue: 1800 }
];

const chartConfig = {
  services: { label: "Services", color: "hsl(var(--primary))" },
  revenue: { label: "Revenue ($)", color: "hsl(var(--accent))" },
};


export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Customers</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Services This Week</CardTitle>
            <CalendarCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">12 scheduled today</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Monthly Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,800.50</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
         <Card className="shadow-md hover:shadow-lg transition-shadow bg-accent text-accent-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Optimize Routes</CardTitle>
            <RouteIcon className="h-5 w-5 text-accent-foreground/80 mt-1" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-accent-foreground/80 mb-3">Plan the most efficient routes for your team.</CardDescription>
            <Button asChild className="w-full bg-accent-foreground text-accent hover:bg-accent-foreground/90">
              <Link href="/admin/smart-routes">Go to Smart Routes</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-primary">Daily Services Overview</CardTitle>
            <CardDescription>Number of services scheduled per day this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={dailyServiceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip cursor={{fill: "hsl(var(--muted))"}} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="services" fill="var(--color-services)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-primary">Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue generated over the past few months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8}/>
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <Tooltip cursor={{stroke: "hsl(var(--border))", strokeWidth: 2}} content={<ChartTooltipContent indicator="line" hideLabel />} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{fill: "var(--color-revenue)", r:4}} activeDot={{r:6}}/>
                </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
      
       <section>
        <h2 className="text-2xl font-semibold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button asChild variant="outline" className="h-20 text-lg justify-start p-4 hover:border-primary hover:text-primary">
            <Link href="/admin/customers">
              <Users className="mr-3 h-6 w-6" /> Manage Customers
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 text-lg justify-start p-4 hover:border-primary hover:text-primary">
            <Link href="/admin/schedules">
              <CalendarCheck className="mr-3 h-6 w-6" /> View Schedules
            </Link>
          </Button>
           <Button asChild variant="outline" className="h-20 text-lg justify-start p-4 hover:border-primary hover:text-primary">
            <Link href="/admin/payments">
              <DollarSign className="mr-3 h-6 w-6" /> Process Payments
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 text-lg justify-start p-4 hover:border-primary hover:text-primary">
            <Link href="/admin/settings">
                <Users className="mr-3 h-6 w-6" /> System Settings
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

