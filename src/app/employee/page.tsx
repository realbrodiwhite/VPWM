
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, MapPin, Clock } from "lucide-react";
import Link from "next/link";

// Mock data for today's tasks
const todayTasks = [
  { id: "T001", customer: "Alice Wonderland", address: "123 Rabbit Hole Ln", time: "10:00 AM - 10:45 AM", service: "Weekly Outdoor Cleanup", status: "Upcoming" },
  { id: "T002", customer: "Bob The Builder", address: "456 Construction Rd", time: "11:15 AM - 12:00 PM", service: "Bi-Weekly Outdoor Cleanup", status: "Upcoming" },
  { id: "T003", customer: "Charlie Brown", address: "789 Kite Flying Park", time: "01:00 PM - 01:45 PM", service: "Weekly Outdoor Cleanup", status: "Upcoming" },
];

export default function EmployeeDashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-1">Welcome, John!</h1>
        <p className="text-muted-foreground">Here's a quick overview of your day.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Tasks Today</CardTitle>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayTasks.filter(t => t.status === "Upcoming").length} upcoming, {todayTasks.filter(t => t.status === "Completed").length} completed
            </p>
          </CardContent>
        </Card>
         <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Next Stop</CardTitle>
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {todayTasks.length > 0 ? (
                <>
                    <div className="text-lg font-semibold">{todayTasks[0].customer}</div>
                    <p className="text-xs text-muted-foreground">{todayTasks[0].address}</p>
                    <p className="text-xs text-muted-foreground">Time: {todayTasks[0].time}</p>
                </>
            ) : (
                <p className="text-sm text-muted-foreground">No upcoming tasks.</p>
            )}
          </CardContent>
        </Card>
         <Card className="shadow-md hover:shadow-lg transition-shadow bg-accent text-accent-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">View Full Schedule</CardTitle>
             <CardDescription className="text-accent-foreground/80">Access your detailed schedule and task information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-accent-foreground text-accent hover:bg-accent-foreground/90">
              <Link href="/employee/schedule">My Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-primary mb-4">Today's Route Overview</h2>
        {todayTasks.length > 0 ? (
          <Card className="shadow-md">
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {todayTasks.map((task) => (
                  <li key={task.id} className="p-4 hover:bg-muted/50">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <div>
                        <p className="font-semibold text-primary">{task.customer} - <span className="font-normal text-foreground/90">{task.service}</span></p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3"/>{task.address}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm">
                        <p className="flex items-center gap-1"><Clock className="w-3 h-3"/>{task.time}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${task.status === "Upcoming" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                     <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-500 hover:bg-green-50 hover:text-green-700">Mark Completed</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md">
            <CardContent className="p-6 text-center text-muted-foreground">
              <ListChecks className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p>No tasks scheduled for today.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
