
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Bell, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock data
const upcomingServices = [
  { id: 1, date: "October 28, 2024", service: "Weekly Cleanup", status: "Scheduled" },
  { id: 2, date: "November 4, 2024", service: "Weekly Cleanup", status: "Scheduled" },
];

const recentActivity = [
    { id: 1, description: "Payment successful for October services.", date: "October 25, 2024"},
    { id: 2, description: "New service 'Yard Deodorizing' added to your plan.", date: "October 20, 2024"},
];

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Upcoming Service</CardTitle>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingServices.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{upcomingServices[0].service}</div>
                <p className="text-xs text-muted-foreground">{upcomingServices[0].date}</p>
              </>
            ) : (
               <p className="text-muted-foreground">No upcoming services.</p>
            )}
            <Button asChild variant="link" className="px-0 text-primary">
                <Link href="/dashboard/services">View All Services →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Account Balance</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">Next bill due November 1st</p>
             <Button asChild variant="link" className="px-0 text-primary">
                <Link href="/dashboard/billing">View Billing Details →</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-accent text-accent-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Book a Service</CardTitle>
            <CardDescription className="text-accent-foreground/80">Need an extra cleanup or a new service?</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-accent-foreground text-accent hover:bg-accent-foreground/90">
              <Link href="/dashboard/book">Schedule Now</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-primary mb-4">Upcoming Services</h2>
        {upcomingServices.length > 0 ? (
        <Card className="shadow-md">
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {upcomingServices.map((service) => (
                <li key={service.id} className="p-4 flex justify-between items-center hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{service.service}</p>
                    <p className="text-sm text-muted-foreground">{service.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{service.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        ) : (
            <Card className="shadow-md">
                <CardContent className="p-6 text-center text-muted-foreground">
                    <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p>You have no upcoming services scheduled.</p>
                    <Button asChild className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/dashboard/book">Book a Service</Link>
                    </Button>
                </CardContent>
            </Card>
        )}
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold text-primary mb-4">Recent Activity</h2>
         {recentActivity.length > 0 ? (
        <Card className="shadow-md">
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="p-4 flex items-start gap-4 hover:bg-muted/50">
                    <Bell className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
         ) : (
            <Card className="shadow-md">
                <CardContent className="p-6 text-center text-muted-foreground">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p>No recent activity to display.</p>
                </CardContent>
            </Card>
         )}
      </section>
       <section className="mt-8 p-6 bg-secondary/30 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <Image src="https://placehold.co/150x150.png" alt="Refer a Friend" width={120} height={120} className="rounded-full" data-ai-hint="gift box"/>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold text-primary">Refer a Friend & Save!</h3>
              <p className="text-foreground/80 mt-2 mb-4">
                Love our service? Share Pet Waste Management with a friend and you both get $10 off your next month!
              </p>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Get Your Referral Code</Button>
            </div>
          </div>
        </section>
    </div>
  );
}
