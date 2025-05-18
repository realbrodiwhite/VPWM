
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, ListFilter, CalendarDays, Edit3 } from "lucide-react";
import React, { useState } from "react";

// Mock data
const appointments = [
  { id: "A001", date: new Date(2024, 9, 28, 10, 0), customer: "Alice Wonderland", service: "Weekly Cleanup", team: "Team A", status: "Scheduled" },
  { id: "A002", date: new Date(2024, 9, 28, 14, 0), customer: "Bob The Builder", service: "Bi-Weekly Cleanup", team: "Team B", status: "Scheduled" },
  { id: "A003", date: new Date(2024, 9, 29, 9, 0), customer: "Charlie Brown", service: "Weekly Cleanup", team: "Team A", status: "Completed" },
  { id: "A004", date: new Date(2024, 9, 29, 11, 0), customer: "Diana Prince", service: "One-Time Cleanup", team: "Team C", status: "Cancelled" },
  { id: "A005", date: new Date(2024, 9, 29, 13, 0), customer: "Edward Scissorhands", service: "Weekly Cleanup", team: "Team B", status: "Scheduled" },
];

export default function SchedulesPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const filteredAppointments = appointments.filter(app => 
    selectedDate && app.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
            <CalendarDays className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Service Schedules</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-1/2 sm:w-auto">
                <ListFilter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-1/2 sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Appointment
            </Button>
        </div>
      </div>

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
              <CardTitle>Appointments for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Today'}</CardTitle>
              <CardDescription>Overview of scheduled services for the selected date.</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAppointments.length > 0 ? (
                <ul className="space-y-4">
                  {filteredAppointments.map((app) => (
                    <li key={app.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-primary">{app.service} - {app.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            Time: {app.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | Team: {app.team}
                          </p>
                        </div>
                        <Badge 
                          variant={app.status === "Scheduled" ? "default" : (app.status === "Completed" ? "secondary" : "destructive")}
                          className={app.status === "Scheduled" ? "bg-blue-500 text-white" : (app.status === "Completed" ? "bg-green-500 text-white" : "bg-red-500 text-white")}
                        >
                          {app.status}
                        </Badge>
                      </div>
                       <div className="mt-2 flex justify-end">
                          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10"><Edit3 className="w-4 h-4 mr-1"/> Edit</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarDays className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p>No appointments scheduled for this date.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
