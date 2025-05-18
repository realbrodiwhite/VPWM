
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { CalendarPlus, Sun, Home, ShieldCheck, Sparkles } from "lucide-react"; // Added Sun, Home, ShieldCheck
import React from "react";

const bookingFormSchema = z.object({
  serviceType: z.string().min(1, { message: "Please select a service type." }),
  date: z.date({ required_error: "Please select a date." }),
  timeSlot: z.string().optional(), 
  notes: z.string().optional(),
  numberOfPets: z.coerce.number().min(1, "At least one pet is required.").max(10, "Max 10 pets for online booking."),
});

type BookingFormInputs = z.infer<typeof bookingFormSchema>;

const serviceOptions = [
  { value: "outdoor_weekly", label: "Weekly Outdoor Cleanup", icon: <Sun className="w-4 h-4 mr-2" /> },
  { value: "indoor_weekly", label: "Weekly Indoor Cleanup", icon: <Home className="w-4 h-4 mr-2" /> },
  { value: "complete_weekly", label: "Weekly Complete Care (Indoor & Outdoor)", icon: <ShieldCheck className="w-4 h-4 mr-2" /> },
  { value: "outdoor_onetime", label: "One-Time Outdoor Cleanup", icon: <Sun className="w-4 h-4 mr-2 opacity-80" /> },
  { value: "indoor_onetime", label: "One-Time Indoor Cleanup", icon: <Home className="w-4 h-4 mr-2 opacity-80" /> },
  { value: "complete_onetime", label: "One-Time Complete Care (Indoor & Outdoor)", icon: <ShieldCheck className="w-4 h-4 mr-2 opacity-80" /> },
  { value: "deodorizing_outdoor", label: "Yard Deodorizing Add-on", icon: <Sparkles className="w-4 h-4 mr-2" /> },
  { value: "deodorizing_indoor", label: "Indoor Odor Control Add-on", icon: <Sparkles className="w-4 h-4 mr-2" /> },
];

export default function BookServicePage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<BookingFormInputs>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      date: new Date(),
      numberOfPets: 1,
    }
  });

  React.useEffect(() => {
    if (selectedDate) {
      setValue("date", selectedDate);
    }
  }, [selectedDate, setValue]);

  const onSubmit: SubmitHandler<BookingFormInputs> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const selectedService = serviceOptions.find(opt => opt.value === data.serviceType);
    console.log("Booking data:", data);
    toast({
      title: "Service Booked!",
      description: `Your ${selectedService?.label || data.serviceType} service for ${data.numberOfPets} pet(s) on ${data.date.toLocaleDateString()} has been scheduled.`,
    });
    reset({ date: new Date(), numberOfPets: 1 });
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarPlus className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Book a Service</h1>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Schedule Your Next Pet Waste Removal</CardTitle>
          <CardDescription>Select your preferred service, date, and provide any special instructions.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="serviceType">Service Type</Label>
                <Controller
                  name="serviceType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="serviceType" className="mt-1">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center">{opt.icon}{opt.label}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.serviceType && <p className="text-sm text-destructive mt-1">{errors.serviceType.message}</p>}
              </div>

              <div>
                <Label htmlFor="numberOfPets">Number of Pets</Label>
                <Controller
                  name="numberOfPets"
                  control={control}
                  render={({ field }) => (
                     <Input id="numberOfPets" type="number" min="1" max="10" {...field} className="mt-1" />
                  )}
                />
                 {errors.numberOfPets && <p className="text-sm text-destructive mt-1">{errors.numberOfPets.message}</p>}
              </div>

              <div>
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea id="notes" placeholder="e.g., Gate code is 1234, be careful of the rose bushes. We have one cat and one dog." {...field} className="mt-1 min-h-[100px]" />
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Select Date</Label>
               <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setSelectedDate(date);
                      }}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
                      className="rounded-md border self-center"
                    />
                  )}
                />
              {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
            
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                {isSubmitting ? "Scheduling..." : "Schedule Service"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
