
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Clock, CheckCircle, Navigation, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for schedule
const mockSchedule = {
  "2024-10-28": [ // Assuming current date is around Oct 2024 for mock data
    { id: "S001", customer: "Alice Wonderland", address: "123 Rabbit Hole Ln", service: "Weekly Outdoor Cleanup", startTime: "10:00", endTime: "10:45", travelTo: 15, status: "Upcoming" },
    { id: "S002", customer: "Bob The Builder", address: "456 Construction Rd", service: "Bi-Weekly Outdoor Cleanup", startTime: "11:15", endTime: "12:00", travelTo: 20, status: "Upcoming" },
    { id: "S003", customer: "Charlie Brown", address: "789 Kite Flying Park", service: "Weekly Outdoor Cleanup", startTime: "13:00", endTime: "13:45", travelTo: 25, status: "Upcoming" },
  ],
  "2024-10-29": [
    { id: "S004", customer: "Diana Prince", address: "1 Themyscira Way", service: "One-Time Cleanup", startTime: "09:00", endTime: "10:00", travelTo: 30, status: "Upcoming" },
    { id: "S005", customer: "Edward Scissorhands", address: "555 Shear Rd", service: "Weekly Outdoor Cleanup", startTime: "10:45", endTime: "11:30", travelTo: 15, status: "Upcoming" },
  ],
};

// Helper function to format date to YYYY-MM-DD
const formatDateToKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export default function EmployeeSchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2024, 9, 28)); // Default to a date with mock data
  
  const dateKey = selectedDate ? formatDateToKey(selectedDate) : "";
  const appointmentsForSelectedDate = mockSchedule[dateKey as keyof typeof mockSchedule] || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">My Schedule</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-lg h-full">
            <CardHeader>
              <CardTitle>Tasks for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Selected Date'}</CardTitle>
              <CardDescription>Overview of your assigned tasks for the selected date.</CardDescription>
            </CardHeader>
            <CardContent>
              {appointmentsForSelectedDate.length > 0 ? (
                <ul className="space-y-4">
                  {appointmentsForSelectedDate.map((task) => (
                    <li key={task.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-background">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                        <div>
                          <p className="font-semibold text-lg text-primary">{task.customer}</p>
                          <p className="text-sm text-foreground/80">{task.service}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/>{task.address}</p>
                        </div>
                        <Badge 
                            variant={task.status === "Upcoming" ? "default" : (task.status === "Completed" ? "secondary" : "outline")}
                            className={task.status === "Upcoming" ? "bg-blue-500 text-white mt-2 sm:mt-0" : (task.status === "Completed" ? "bg-green-500 text-white mt-2 sm:mt-0" : "mt-2 sm:mt-0")}
                        >
                            {task.status}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-1 text-sm">
                        {task.travelTo > 0 && 
                            <p className="flex items-center gap-1 text-muted-foreground"><Navigation className="w-4 h-4 text-blue-500"/> Est. Travel: {task.travelTo} mins</p>
                        }
                        <p className="flex items-center gap-1"><Clock className="w-4 h-4 text-green-600"/> Scheduled: {task.startTime} - {task.endTime}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="flex-grow sm:flex-grow-0"><Truck className="w-4 h-4 mr-2"/>Navigate</Button>
                        <Button size="sm" variant="outline" className="flex-grow sm:flex-grow-0">Task Details</Button>
                        {task.status === "Upcoming" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-grow sm:flex-grow-0">
                            <CheckCircle className="w-4 h-4 mr-2"/>Mark as Complete
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p>No tasks scheduled for this date.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
