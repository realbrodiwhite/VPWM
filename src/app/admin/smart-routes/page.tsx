
"use client";
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler, FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Route as RouteIcon, PlusCircle, Trash2, Loader2, MapPin, Clock, Coffee, Utensils, ClipboardList, Navigation, AlertTriangle, Fuel } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { suggestOptimizedRoutes, type SuggestOptimizedRoutesInput, type SuggestOptimizedRoutesOutput } from '@/ai/flows/suggest-optimized-routes';


const MIN_BASE_SERVICE_TIME_POINTS_SYSTEM = 15;
const SETUP_CLEANUP_TIME_MINUTES = 10;

const BREAK_NAMES = {
  SHORT: "Short Break (15 min)",
  LUNCH: "Lunch Break (60 min)",
};

const appointmentSchema = z.object({
  id: z.string().optional(), // For unique key in map
  customerName: z.string().min(1, "Customer name or Task description is required"),
  address: z.string().min(1, "Address or Location is required"),
  priority: z.enum(['high', 'medium', 'low']),
  dogs: z.enum(['1', '2', '3', 'more'], { required_error: "Please select the number of dogs." }),
  num_more_dogs: z.coerce.number().min(4, "Must be at least 4 dogs.").optional(),
  yard_size: z.enum(['small', 'medium', 'large', 'extralarge'], { required_error: "Please select the yard size." }),
  acres_extralarge: z.coerce.number().min(1.1, "Must be over 1 acre.").optional(),
  accessibility: z.enum(['easy', 'minor', 'difficult'], { required_error: "Please select yard accessibility." }),
  visit_type: z.enum(['onetime', 'initial_recurring', 'regular_recurring', 'second_weekly'], { required_error: "Please select the visit type." }),
  recurring_freq: z.enum(['weekly', 'biweekly', 'monthly']).optional(),
  initial_condition: z.enum(['recent', 'moderate', 'heavy']).optional(),
  heavy_points: z.coerce.number().min(6, "Min 6 points.").max(10, "Max 10 points.").optional(),
  addon_deodorizing: z.boolean().optional(),
  addon_disposal: z.boolean().optional(),
  serviceTime: z.coerce.number().min(1, `Service/Stop time must be at least 1 minute.`),
})
.refine(data => !(data.dogs === 'more' && (data.num_more_dogs === undefined || isNaN(data.num_more_dogs) || data.num_more_dogs < 4)), {
  message: "Please specify the total number of dogs (4 or more).",
  path: ['num_more_dogs'],
})
.refine(data => !(data.yard_size === 'extralarge' && (data.acres_extralarge === undefined || isNaN(data.acres_extralarge) || data.acres_extralarge <= 1)), {
  message: "Please specify acreage greater than 1.",
  path: ['acres_extralarge'],
})
.refine(data => !((data.visit_type === 'initial_recurring' || data.visit_type === 'regular_recurring') && !data.recurring_freq && data.customerName !== BREAK_NAMES.SHORT && data.customerName !== BREAK_NAMES.LUNCH), {
    message: "Please select recurring frequency.",
    path: ['recurring_freq'],
})
.refine(data => !((data.visit_type === 'onetime' || data.visit_type === 'initial_recurring') && !data.initial_condition && data.customerName !== BREAK_NAMES.SHORT && data.customerName !== BREAK_NAMES.LUNCH), {
    message: "Please select initial cleanup condition.",
    path: ['initial_condition'],
})
.refine(data => !((data.visit_type === 'onetime' || data.visit_type === 'initial_recurring') && data.initial_condition === 'heavy' && (data.heavy_points === undefined || isNaN(data.heavy_points) || data.heavy_points < 6 || data.heavy_points > 10) && data.customerName !== BREAK_NAMES.SHORT && data.customerName !== BREAK_NAMES.LUNCH), {
    message: "Please assign points for heavy accumulation (6-10).",
    path: ['heavy_points'],
})
.refine(data => {
  if (data.customerName === BREAK_NAMES.SHORT || data.customerName === BREAK_NAMES.LUNCH) return true;
  return data.serviceTime >= (MIN_BASE_SERVICE_TIME_POINTS_SYSTEM + SETUP_CLEANUP_TIME_MINUTES);
}, { message: `Service time must be at least ${MIN_BASE_SERVICE_TIME_POINTS_SYSTEM + SETUP_CLEANUP_TIME_MINUTES} minutes (incl. setup/cleanup) for non-break tasks.`, path: ['serviceTime'] });

const smartRoutesSchema = z.object({
  currentLocation: z.string().min(1, "Current location is required"),
  startOfDay: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be in HH:MM format (e.g., 08:00)"),
  appointments: z.array(appointmentSchema).min(1, "At least one appointment/task is required"),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;
type SmartRoutesFormValues = z.infer<typeof smartRoutesSchema>;

const calculatePointsForAppointment = (data: Partial<AppointmentFormValues>): number => {
  let points = { dogs: 0, yard: 0, access: 0, frequency: 0, initial: 0, addons: 0 };
  if (data.dogs === '1') points.dogs = 1;
  else if (data.dogs === '2') points.dogs = 2;
  else if (data.dogs === '3') points.dogs = 3;
  else if (data.dogs === 'more' && data.num_more_dogs && data.num_more_dogs >= 4) {
    points.dogs = 3 + (data.num_more_dogs - 3);
  }
  if (data.yard_size === 'small') points.yard = 1;
  else if (data.yard_size === 'medium') points.yard = 2;
  else if (data.yard_size === 'large') points.yard = 3;
  else if (data.yard_size === 'extralarge' && data.acres_extralarge && data.acres_extralarge > 1) {
    const additionalAcres = Math.max(0, data.acres_extralarge - 1);
    points.yard = 3 + Math.round(additionalAcres * 2);
  }
  if (data.accessibility === 'easy') points.access = 0;
  else if (data.accessibility === 'minor') points.access = 1;
  else if (data.accessibility === 'difficult') points.access = 3;
  if (data.visit_type === 'onetime') points.frequency = 10;
  else if (data.visit_type === 'second_weekly') points.frequency = 1;
  else if ((data.visit_type === 'initial_recurring' || data.visit_type === 'regular_recurring') && data.recurring_freq) {
    if (data.recurring_freq === 'weekly') points.frequency = 2;
    else if (data.recurring_freq === 'biweekly') points.frequency = 4;
    else if (data.recurring_freq === 'monthly') points.frequency = 7;
  }
  const shouldShowInitial = data.visit_type === 'onetime' || data.visit_type === 'initial_recurring';
  if (shouldShowInitial && data.initial_condition) {
    if (data.initial_condition === 'recent') points.initial = 0;
    else if (data.initial_condition === 'moderate') points.initial = 3;
    else if (data.initial_condition === 'heavy' && data.heavy_points && data.heavy_points >=6 && data.heavy_points <=10) {
      points.initial = data.heavy_points;
    }
  }
  if (data.addon_deodorizing) points.addons += 2;
  if (data.addon_disposal) points.addons += 1;
  return points.dogs + points.yard + points.access + points.frequency + points.initial + points.addons;
};

const convertPointsToTime = (totalPoints: number): number => {
  const pointsBasedTime = MIN_BASE_SERVICE_TIME_POINTS_SYSTEM + (totalPoints * 2.5);
  const estimatedTimeWithOverhead = pointsBasedTime + SETUP_CLEANUP_TIME_MINUTES;
  return Math.max(MIN_BASE_SERVICE_TIME_POINTS_SYSTEM + SETUP_CLEANUP_TIME_MINUTES, Math.round(estimatedTimeWithOverhead));
};

const defaultAppointmentDetails: Omit<AppointmentFormValues, 'id' | 'customerName' | 'address' | 'priority' | 'serviceTime'> = {
    dogs: '1', yard_size: 'small', accessibility: 'easy', visit_type: 'regular_recurring', recurring_freq: 'weekly',
    num_more_dogs: undefined, acres_extralarge: undefined, initial_condition: undefined, heavy_points: undefined,
    addon_deodorizing: false, addon_disposal: false,
};
const defaultCalculatedServiceTime = convertPointsToTime(calculatePointsForAppointment(defaultAppointmentDetails));

const defaultServiceAppointmentValues: AppointmentFormValues = {
    id: crypto.randomUUID(), customerName: '', address: '', priority: 'medium', ...defaultAppointmentDetails, serviceTime: defaultCalculatedServiceTime
};

const getBreakAppointmentValues = (type: "short" | "lunch", currentLocationValue: string): AppointmentFormValues => {
  const breakDuration = type === "short" ? 15 : 60;
  const breakName = type === "short" ? BREAK_NAMES.SHORT : BREAK_NAMES.LUNCH;
  return {
    id: crypto.randomUUID(), ...defaultAppointmentDetails, customerName: breakName, address: currentLocationValue || "On Route",
    priority: 'low', serviceTime: breakDuration, visit_type: 'onetime', initial_condition: 'recent', dogs: '1', yard_size: 'small', accessibility: 'easy' // ensure all required fields have basic defaults for breaks
  };
};

export default function SmartRoutesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleResults, setScheduleResults] = useState<SuggestOptimizedRoutesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SmartRoutesFormValues>({
    resolver: zodResolver(smartRoutesSchema),
    defaultValues: {
      currentLocation: '',
      startOfDay: '08:00',
      appointments: [{ ...defaultServiceAppointmentValues, id: crypto.randomUUID() }],
    },
    mode: 'onChange',
  });

  const { control, handleSubmit, formState: { errors }, watch, setValue, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'appointments',
  });

  const watchedAppointments = watch('appointments');
  const currentLocationValue = watch('currentLocation');

  useEffect(() => {
    watchedAppointments.forEach((app, index) => {
      if (app.customerName === BREAK_NAMES.SHORT || app.customerName === BREAK_NAMES.LUNCH) {
        const expectedTime = app.customerName === BREAK_NAMES.SHORT ? 15 : 60;
        if (app.serviceTime !== expectedTime) {
          setValue(`appointments.${index}.serviceTime`, expectedTime, { shouldValidate: true });
        }
        const breakDefaults = getBreakAppointmentValues(app.customerName === BREAK_NAMES.SHORT ? "short" : "lunch", app.address);
        // Ensure all required fields from appointmentSchema have a valid default for breaks
        (Object.keys(defaultAppointmentDetails) as Array<keyof typeof defaultAppointmentDetails>).forEach(key => {
            if (app[key] !== breakDefaults[key]) {
                 setValue(`appointments.${index}.${key as FieldPath<SmartRoutesFormValues>}`, breakDefaults[key] as any, { shouldValidate: false }); // don't re-validate break specific fields
            }
        });
        return;
      }
      const points = calculatePointsForAppointment(app);
      const time = convertPointsToTime(points);
      const currentServiceTime = getValues(`appointments.${index}.serviceTime`);
      if (time !== currentServiceTime) {
        setValue(`appointments.${index}.serviceTime`, time, { shouldValidate: true });
      }
    });
  }, [watchedAppointments, setValue, getValues]);

  const onSubmit: SubmitHandler<SmartRoutesFormValues> = async (data) => {
    setIsLoading(true);
    setScheduleResults(null);
    setError(null);
    try {
      // Prepare input for AI flow
      const aiInput: SuggestOptimizedRoutesInput = {
        currentLocation: data.currentLocation,
        startOfDay: data.startOfDay,
        appointments: data.appointments.map(app => ({
          customerName: app.customerName,
          address: app.address,
          serviceTime: app.serviceTime,
          priority: app.priority,
        })),
      };

      const result = await suggestOptimizedRoutes(aiInput);
      setScheduleResults(result);
      toast({
        title: "AI Optimized Schedule Generated!",
        description: "The AI has proposed an optimized route and schedule.",
      });
    } catch (e) {
      console.error("Error generating AI schedule:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while contacting the AI scheduler.";
      setError(`Failed to generate AI schedule: ${errorMessage}`);
      toast({
        title: "AI Scheduling Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalWorkTime = watchedAppointments
    .filter(app => app.customerName !== BREAK_NAMES.SHORT && app.customerName !== BREAK_NAMES.LUNCH)
    .reduce((sum, app) => sum + (Number(app.serviceTime) || 0), 0);
  const shortBreaksTaken = watchedAppointments.filter(app => app.customerName === BREAK_NAMES.SHORT).length;
  const lunchBreaksTaken = watchedAppointments.filter(app => app.customerName === BREAK_NAMES.LUNCH).length;
  const canTakeShortBreak = shortBreaksTaken < 2;
  const canTakeLunchBreak = lunchBreaksTaken < 1 && totalWorkTime >= 240; // 4 hours = 240 minutes

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <RouteIcon className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">AI Route Optimizer & Scheduler</h1>
      </div>
      <Alert variant="default" className="bg-primary/10 border-primary/30">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-semibold">AI-Powered Scheduling</AlertTitle>
        <AlertDescription className="text-primary/80">
          This tool uses AI to optimize routes and estimate travel times.
          Service times for jobs automatically include {SETUP_CLEANUP_TIME_MINUTES} minutes for setup/cleanup.
          Add breaks using the dedicated buttons.
        </AlertDescription>
      </Alert>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Generate Optimized Service Schedule</CardTitle>
              <CardDescription>
                Input task details, start location, and desired start time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="currentLocation"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Start Location (Vehicle)</FormLabel>
                        <FormControl><Input placeholder="e.g., 123 Main St, Anytown" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="startOfDay"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Desired Start Time (HH:MM)</FormLabel>
                        <FormControl><Input type="time" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
              <Separator />
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <Button type="button" variant="outline" onClick={() => append({...defaultServiceAppointmentValues, id: crypto.randomUUID()})} className="flex-grow sm:flex-grow-0">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Task/Appointment
                    </Button>
                    <Button type="button" variant="outline" onClick={() => append(getBreakAppointmentValues("short", currentLocationValue))} disabled={!canTakeShortBreak} className="flex-grow sm:flex-grow-0">
                        <Coffee className="mr-2 h-4 w-4" /> Add 15-min Break ({shortBreaksTaken}/2)
                    </Button>
                    <Button type="button" variant="outline" onClick={() => append(getBreakAppointmentValues("lunch", currentLocationValue))} disabled={!canTakeLunchBreak} className="flex-grow sm:flex-grow-0">
                        <Utensils className="mr-2 h-4 w-4" /> Add 60-min Lunch ({lunchBreaksTaken}/1)
                    </Button>
                </div>
                <h3 className="text-lg font-medium text-primary mb-2 flex items-center gap-2"><ClipboardList className="w-5 h-5"/>Scheduled Stops</h3>
                {fields.map((item, index) => {
                  const currentAppointment = watchedAppointments[index] || {};
                  const isBreak = currentAppointment.customerName === BREAK_NAMES.SHORT || currentAppointment.customerName === BREAK_NAMES.LUNCH;
                  const visitType = watch(`appointments.${index}.visit_type`);
                  const initialCondition = watch(`appointments.${index}.initial_condition`);
                  const numDogs = watch(`appointments.${index}.dogs`);
                  const yardSize = watch(`appointments.${index}.yard_size`);
                  const showRecurring = !isBreak && (visitType === 'initial_recurring' || visitType === 'regular_recurring');
                  const showInitial = !isBreak && (visitType === 'onetime' || visitType === 'initial_recurring');
                  const showHeavy = !isBreak && showInitial && initialCondition === 'heavy';
                  const showNumMore = !isBreak && numDogs === 'more';
                  const showAcres = !isBreak && yardSize === 'extralarge';

                  return (
                    <Card key={item.id} className="mb-4 p-4 bg-muted/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField control={control} name={`appointments.${index}.customerName`} render={({ field: f }) => (
                            <FormItem><FormLabel>Task / Customer</FormLabel><FormControl><Input placeholder={isBreak ? "Break Time" : "Customer Name or Task"} {...f} className="bg-background" readOnly={isBreak} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name={`appointments.${index}.address`} render={({ field: f }) => (
                            <FormItem><FormLabel>Location / Address</FormLabel><FormControl><Input placeholder={isBreak ? "On Route / Break Location" : "Service Address"} {...f} className="bg-background" /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={control} name={`appointments.${index}.priority`} render={({ field: controllerField }) => (
                            <FormItem><FormLabel>Priority</FormLabel><Select onValueChange={controllerField.onChange} defaultValue={controllerField.value} disabled={isBreak}><FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl><SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name={`appointments.${index}.serviceTime`} render={({ field: f }) => (
                            <FormItem className="lg:col-start-3"><FormLabel>Est. Total Stop Time (mins)</FormLabel><FormControl><Input readOnly {...f} className="bg-background border-dashed" /></FormControl>{!isBreak && <FormDescription>Incl. {SETUP_CLEANUP_TIME_MINUTES} min setup/cleanup.</FormDescription>}{isBreak && <FormDescription>Fixed break duration.</FormDescription>}<FormMessage /></FormItem>
                        )} />
                        {!isBreak && (
                          <>
                            <FormField control={control} name={`appointments.${index}.dogs`} render={({ field: f }) => (
                                <FormItem className="space-y-1 md:col-span-1"><FormLabel>Number of Dogs</FormLabel><FormControl><RadioGroup onValueChange={f.onChange} defaultValue={f.value} className="flex flex-wrap gap-x-4 gap-y-2"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="1" /></FormControl><FormLabel className="font-normal">1</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="2" /></FormControl><FormLabel className="font-normal">2</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="3" /></FormControl><FormLabel className="font-normal">3</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="more" /></FormControl><FormLabel className="font-normal">More</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                            )} />
                            {showNumMore && <FormField control={control} name={`appointments.${index}.num_more_dogs`} render={({ field: f }) => (
                                <FormItem><FormLabel>Total Dogs</FormLabel><FormControl><Input type="number" placeholder="e.g. 4" {...f} onChange={e=>f.onChange(+e.target.value)} className="w-24 bg-background"/></FormControl><FormMessage /></FormItem>
                            )} />}
                            <FormField control={control} name={`appointments.${index}.yard_size`} render={({ field: f }) => (
                                <FormItem className="space-y-1 md:col-span-1"><FormLabel>Yard Size</FormLabel><FormControl><RadioGroup onValueChange={f.onChange} defaultValue={f.value} className="flex flex-wrap gap-x-4 gap-y-2"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="small" /></FormControl><FormLabel className="font-normal">S</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="medium" /></FormControl><FormLabel className="font-normal">M</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="large" /></FormControl><FormLabel className="font-normal">L</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="extralarge" /></FormControl><FormLabel className="font-normal">XL</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                            )} />
                            {showAcres && <FormField control={control} name={`appointments.${index}.acres_extralarge`} render={({ field: f }) => (
                                <FormItem><FormLabel>Acreage</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g. 1.5" {...f} onChange={e=>f.onChange(parseFloat(e.target.value))} className="w-24 bg-background"/></FormControl><FormMessage /></FormItem>
                            )} />}
                            <FormField control={control} name={`appointments.${index}.accessibility`} render={({ field: f }) => (
                                <FormItem className="space-y-1"><FormLabel>Accessibility</FormLabel><FormControl><RadioGroup onValueChange={f.onChange} defaultValue={f.value} className="flex gap-x-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="easy" /></FormControl><FormLabel className="font-normal">Easy</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="minor" /></FormControl><FormLabel className="font-normal">Minor</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="difficult" /></FormControl><FormLabel className="font-normal">Difficult</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={control} name={`appointments.${index}.visit_type`} render={({ field: f }) => (
                                <FormItem className="md:col-span-1"><FormLabel>Visit Type</FormLabel><Select onValueChange={f.onChange} defaultValue={f.value}><FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="onetime">One-time</SelectItem><SelectItem value="initial_recurring">Initial Recurring</SelectItem><SelectItem value="regular_recurring">Regular Recurring</SelectItem><SelectItem value="second_weekly">Second Weekly</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            {showRecurring && <FormField control={control} name={`appointments.${index}.recurring_freq`} render={({ field: f }) => (
                                <FormItem><FormLabel>Recurring Freq.</FormLabel><Select onValueChange={f.onChange} defaultValue={f.value}><FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl><SelectContent><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="biweekly">Bi-weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />}
                            {showInitial && <FormField control={control} name={`appointments.${index}.initial_condition`} render={({ field: f }) => (
                                <FormItem><FormLabel>Initial Condition</FormLabel><Select onValueChange={f.onChange} defaultValue={f.value}><FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Select condition" /></SelectTrigger></FormControl><SelectContent><SelectItem value="recent">Recent</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="heavy">Heavy</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                            )} />}
                            {showHeavy && <FormField control={control} name={`appointments.${index}.heavy_points`} render={({ field: f }) => (
                                <FormItem><FormLabel>Heavy Pts (6-10)</FormLabel><FormControl><Input type="number" min="6" max="10" {...f} onChange={e=>f.onChange(+e.target.value)} className="w-24 bg-background"/></FormControl><FormMessage /></FormItem>
                            )} />}
                            <div className="md:col-span-3 space-y-2 pt-2">
                                <Label>Add-ons for this stop:</Label>
                                <div className="flex gap-4">
                                <FormField control={control} name={`appointments.${index}.addon_deodorizing`} render={({ field: f }) => (
                                    <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={f.value} onCheckedChange={f.onChange} /></FormControl><FormLabel className="font-normal">Deodorizing</FormLabel></FormItem>
                                )} />
                                <FormField control={control} name={`appointments.${index}.addon_disposal`} render={({ field: f }) => (
                                    <FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={f.value} onCheckedChange={f.onChange} /></FormControl><FormLabel className="font-normal">Waste Disposal</FormLabel></FormItem>
                                )} />
                                </div>
                            </div>
                          </>
                        )}
                      </div>
                      <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="mt-4">
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Stop
                      </Button>
                    </Card>
                  );
                })}
              </div>
              {errors.appointments && typeof errors.appointments === 'object' && !Array.isArray(errors.appointments) && (
                <p className="text-sm text-destructive mt-1">{errors.appointments.message}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || fields.length === 0}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RouteIcon className="mr-2 h-4 w-4" />}
                {isLoading ? 'Optimizing...' : 'Generate AI Optimized Schedule'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {error && (
         <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {scheduleResults && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">AI Generated Schedule</CardTitle>
             <CardDescription>
              The AI has optimized the route and calculated the schedule based on your inputs and desired start time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                    <Clock className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Estimated On-Site Time</p>
                        <p className="text-lg font-semibold text-primary">
                            {scheduleResults.optimizedRoutes.reduce((sum, item) => sum + item.serviceTime, 0)} minutes
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                    <Navigation className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Estimated Travel Time</p>
                        <p className="text-lg font-semibold text-primary">{scheduleResults.totalTravelTime} minutes</p>
                    </div>
                </div>
                {scheduleResults.totalFuelConsumption && (
                 <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md md:col-span-2">
                    <Fuel className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Estimated Fuel Consumption</p>
                        <p className="text-lg font-semibold text-primary">{scheduleResults.totalFuelConsumption.toFixed(1)} liters</p>
                    </div>
                </div>
                )}
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-primary mb-2">Optimized Route & Schedule:</h4>
              <ol className="list-decimal list-inside space-y-4">
                {scheduleResults.optimizedRoutes.map((item, index) => (
                  <li key={item.customerName + '-' + index} className="p-4 border rounded-md bg-background hover:shadow-md transition-shadow">
                    <p className="font-semibold text-primary">{index + 1}. {item.customerName}</p>
                    <div className="text-sm text-muted-foreground ml-2 space-y-1 mt-1">
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {item.address}</div>
                        {item.travelTimeToThisStop !== undefined && item.travelTimeToThisStop > 0 && (
                             <div className="flex items-center gap-2"><Navigation className="w-4 h-4 text-blue-500"/> Travel to this stop: {item.travelTimeToThisStop} mins</div>
                        )}
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-green-600"/> Est. Arrival / Start: {item.estimatedStartTime}</div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4"/> On-site duration: {item.serviceTime} mins</div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-600"/> Est. Departure: {item.estimatedEndTime}</div>
                        <div className="flex items-center gap-2"> Priority: <Badge variant={item.priority === "high" ? "destructive" : (item.priority === "medium" ? "default" : "secondary")} className="capitalize">{item.priority}</Badge></div>
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
