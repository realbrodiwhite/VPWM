
"use client";
import React, { useState } from 'react';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Route as RouteIcon, PlusCircle, Trash2, Loader2, MapPin, Clock, Fuel } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestOptimizedRoutes, SuggestOptimizedRoutesInput, SuggestOptimizedRoutesOutput } from '@/ai/flows/suggest-optimized-routes';
import { useToast } from '@/hooks/use-toast';

const appointmentSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  address: z.string().min(1, "Address is required"),
  serviceTime: z.coerce.number().min(5, "Service time must be at least 5 minutes"),
  priority: z.enum(['high', 'medium', 'low']),
});

const smartRoutesSchema = z.object({
  currentLocation: z.string().min(1, "Current location is required"),
  appointments: z.array(appointmentSchema).min(1, "At least one appointment is required"),
});

type SmartRoutesFormValues = z.infer<typeof smartRoutesSchema>;

export default function SmartRoutesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [routeResults, setRouteResults] = useState<SuggestOptimizedRoutesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { control, register, handleSubmit, formState: { errors } } = useForm<SmartRoutesFormValues>({
    resolver: zodResolver(smartRoutesSchema),
    defaultValues: {
      currentLocation: '',
      appointments: [{ customerName: '', address: '', serviceTime: 30, priority: 'medium' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'appointments',
  });

  const onSubmit: SubmitHandler<SmartRoutesFormValues> = async (data) => {
    setIsLoading(true);
    setRouteResults(null);
    setError(null);
    try {
      const result = await suggestOptimizedRoutes(data as SuggestOptimizedRoutesInput);
      setRouteResults(result);
      toast({
        title: "Route Optimized!",
        description: "AI has generated an optimized route.",
      });
    } catch (e) {
      console.error("Error optimizing routes:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to optimize routes: ${errorMessage}`);
      toast({
        title: "Optimization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <RouteIcon className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Smart Route Optimization</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate Efficient Service Routes</CardTitle>
          <CardDescription>Input appointment details and current location to get AI-powered route suggestions.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="currentLocation">Current Vehicle Location</Label>
              <Input
                id="currentLocation"
                placeholder="e.g., 123 Main St, Anytown, USA or GPS coordinates"
                {...register('currentLocation')}
                className="mt-1"
              />
              {errors.currentLocation && <p className="text-sm text-destructive mt-1">{errors.currentLocation.message}</p>}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium text-primary mb-2">Appointments</h3>
              {fields.map((field, index) => (
                <Card key={field.id} className="mb-4 p-4 bg-muted/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`appointments.${index}.customerName`}>Customer Name</Label>
                      <Input
                        id={`appointments.${index}.customerName`}
                        placeholder="John Doe"
                        {...register(`appointments.${index}.customerName`)}
                        className="mt-1 bg-background"
                      />
                      {errors.appointments?.[index]?.customerName && <p className="text-sm text-destructive mt-1">{errors.appointments[index]?.customerName?.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor={`appointments.${index}.address`}>Address</Label>
                      <Input
                        id={`appointments.${index}.address`}
                        placeholder="456 Oak Ave, Anytown, USA"
                        {...register(`appointments.${index}.address`)}
                        className="mt-1 bg-background"
                      />
                      {errors.appointments?.[index]?.address && <p className="text-sm text-destructive mt-1">{errors.appointments[index]?.address?.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor={`appointments.${index}.serviceTime`}>Service Time (minutes)</Label>
                      <Input
                        id={`appointments.${index}.serviceTime`}
                        type="number"
                        placeholder="30"
                        {...register(`appointments.${index}.serviceTime`)}
                        className="mt-1 bg-background"
                      />
                      {errors.appointments?.[index]?.serviceTime && <p className="text-sm text-destructive mt-1">{errors.appointments[index]?.serviceTime?.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor={`appointments.${index}.priority`}>Priority</Label>
                       <Controller
                          name={`appointments.${index}.priority`}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Select onValueChange={controllerField.onChange} defaultValue={controllerField.value}>
                              <SelectTrigger id={`appointments.${index}.priority`} className="mt-1 bg-background">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      {errors.appointments?.[index]?.priority && <p className="text-sm text-destructive mt-1">{errors.appointments[index]?.priority?.message}</p>}
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="mt-4">
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Appointment
                    </Button>
                  )}
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ customerName: '', address: '', serviceTime: 30, priority: 'medium' })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Appointment
              </Button>
              {errors.appointments && typeof errors.appointments === 'object' && !Array.isArray(errors.appointments) && (
                <p className="text-sm text-destructive mt-1">{errors.appointments.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RouteIcon className="mr-2 h-4 w-4" />}
              {isLoading ? 'Optimizing...' : 'Generate Optimized Route'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
         <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {routeResults && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Optimized Route Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                    <Clock className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Estimated Travel Time</p>
                        <p className="text-lg font-semibold text-primary">{routeResults.totalTravelTime} minutes</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                    <Fuel className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Estimated Fuel Consumption</p>
                        <p className="text-lg font-semibold text-primary">{routeResults.totalFuelConsumption} liters</p>
                    </div>
                </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-primary mb-2">Route Order:</h4>
              <ol className="list-decimal list-inside space-y-3">
                {routeResults.optimizedRoutes.map((route, index) => (
                  <li key={index} className="p-3 border rounded-md bg-background hover:shadow-md transition-shadow">
                    <p className="font-semibold text-primary">{index + 1}. {route.customerName}</p>
                    <div className="text-sm text-muted-foreground ml-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4"/> {route.address}
                    </div>
                    <div className="text-sm text-muted-foreground ml-2 flex items-center gap-2">
                        <Clock className="w-4 h-4"/> Service Time: {route.serviceTime} mins
                    </div>
                    <div className="text-sm text-muted-foreground ml-2 flex items-center gap-2">
                         Priority: <Badge variant={route.priority === "high" ? "destructive" : (route.priority === "medium" ? "default" : "secondary")} className="capitalize">{route.priority}</Badge>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
