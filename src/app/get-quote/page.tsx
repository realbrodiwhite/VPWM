
"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, AlertCircle, PawPrint } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const pricingFormSchema = z.object({
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
})
.refine(data => !(data.dogs === 'more' && (data.num_more_dogs === undefined || isNaN(data.num_more_dogs))), {
  message: "Please specify the total number of dogs if 'More Than 3' is selected.",
  path: ['num_more_dogs'],
})
.refine(data => !(data.yard_size === 'extralarge' && (data.acres_extralarge === undefined || isNaN(data.acres_extralarge))), {
  message: "Please specify the acreage if 'Extra Large' yard is selected.",
  path: ['acres_extralarge'],
})
.refine(data => !((data.visit_type === 'initial_recurring' || data.visit_type === 'regular_recurring') && !data.recurring_freq), {
    message: "Please select recurring frequency.",
    path: ['recurring_freq'],
})
.refine(data => !((data.visit_type === 'onetime' || data.visit_type === 'initial_recurring') && !data.initial_condition), {
    message: "Please select initial cleanup condition.",
    path: ['initial_condition'],
})
.refine(data => !((data.visit_type === 'onetime' || data.visit_type === 'initial_recurring') && data.initial_condition === 'heavy' && (data.heavy_points === undefined || isNaN(data.heavy_points))), {
    message: "Please assign points for heavy accumulation (6-10).",
    path: ['heavy_points'],
});


type PricingFormValues = z.infer<typeof pricingFormSchema>;

interface PointsBreakdown {
  dogs: number;
  yard: number;
  access: number;
  frequency: number;
  initial: number;
  addons: number;
  total: number;
}

export default function GetQuotePage() {
  const { toast } = useToast();
  const [calculationResult, setCalculationResult] = useState<PointsBreakdown | null>(null);

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingFormSchema),
    defaultValues: {
      dogs: undefined,
      yard_size: undefined,
      accessibility: undefined,
      visit_type: undefined,
      addon_deodorizing: false,
      addon_disposal: false,
    },
  });

  const { watch, control, setValue } = form;
  const watchedVisitType = watch('visit_type');
  const watchedInitialCondition = watch('initial_condition');
  const watchedDogs = watch('dogs');
  const watchedYardSize = watch('yard_size');

  const showRecurringFrequency = watchedVisitType === 'initial_recurring' || watchedVisitType === 'regular_recurring';
  const showInitialConditionSection = watchedVisitType === 'onetime' || watchedVisitType === 'initial_recurring';
  const showHeavyConditionPoints = showInitialConditionSection && watchedInitialCondition === 'heavy';
  const showNumMoreDogs = watchedDogs === 'more';
  const showAcresExtraLarge = watchedYardSize === 'extralarge';

   useEffect(() => {
    if (!showRecurringFrequency) {
      setValue('recurring_freq', undefined);
    }
    if (!showInitialConditionSection) {
      setValue('initial_condition', undefined);
    }
    if (!showHeavyConditionPoints) {
      setValue('heavy_points', undefined);
    }
    if (!showNumMoreDogs) {
      setValue('num_more_dogs', undefined);
    }
    if (!showAcresExtraLarge) {
      setValue('acres_extralarge', undefined);
    }
  }, [showRecurringFrequency, showInitialConditionSection, showHeavyConditionPoints, showNumMoreDogs, showAcresExtraLarge, setValue]);


  const calculatePoints: SubmitHandler<PricingFormValues> = (data) => {
    let points = {
      dogs: 0,
      yard: 0,
      access: 0,
      frequency: 0,
      initial: 0,
      addons: 0,
      total: 0,
    };

    // 1. Dogs
    if (data.dogs === '1') points.dogs = 1;
    else if (data.dogs === '2') points.dogs = 2;
    else if (data.dogs === '3') points.dogs = 3;
    else if (data.dogs === 'more' && data.num_more_dogs) {
      points.dogs = 3 + (data.num_more_dogs - 3);
    }

    // 2. Yard Size
    if (data.yard_size === 'small') points.yard = 1;
    else if (data.yard_size === 'medium') points.yard = 2;
    else if (data.yard_size === 'large') points.yard = 3;
    else if (data.yard_size === 'extralarge' && data.acres_extralarge) {
      const additionalAcres = Math.max(0, data.acres_extralarge - 1);
      points.yard = 3 + Math.round(additionalAcres * 2);
    }

    // 3. Accessibility
    if (data.accessibility === 'easy') points.access = 0;
    else if (data.accessibility === 'minor') points.access = 1;
    else if (data.accessibility === 'difficult') points.access = 3;

    // 4. Visit Type / Base Frequency
    if (data.visit_type === 'onetime') {
      points.frequency = 10;
    } else if (data.visit_type === 'second_weekly') {
      points.frequency = 1;
    } else if (data.recurring_freq) { // initial_recurring or regular_recurring
      if (data.recurring_freq === 'weekly') points.frequency = 2;
      else if (data.recurring_freq === 'biweekly') points.frequency = 4;
      else if (data.recurring_freq === 'monthly') points.frequency = 7;
    }

    // 5. Initial Cleanup Condition
    if (showInitialConditionSection && data.initial_condition) {
      if (data.initial_condition === 'recent') points.initial = 0;
      else if (data.initial_condition === 'moderate') points.initial = 3;
      else if (data.initial_condition === 'heavy' && data.heavy_points) {
        points.initial = data.heavy_points;
      }
    }

    // 6. Additional Services
    if (data.addon_deodorizing) points.addons += 2;
    if (data.addon_disposal) points.addons += 1;

    points.total = points.dogs + points.yard + points.access + points.frequency + points.initial + points.addons;
    setCalculationResult(points);
    toast({
      title: "Quote Calculated!",
      description: `Total points for this visit: ${points.total}. See breakdown below.`,
    });
  };

  return (
    <div className="container py-8 md:py-12">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Calculator className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Get an Instant Quote</CardTitle>
          <CardDescription>Complete the details below to estimate the points for your service visit. Prices are based on point tiers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(calculatePoints)} className="space-y-8">
              
              {/* Number of Dogs */}
              <FormField
                control={control}
                name="dogs"
                render={({ field }) => (
                  <FormItem className="space-y-3 p-4 border rounded-md bg-card">
                    <FormLabel className="text-lg font-semibold text-primary">1. Number of Dogs</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="1" /></FormControl>
                          <FormLabel className="font-normal">1 Dog <span className="text-muted-foreground text-sm">(1 point)</span></FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="2" /></FormControl>
                          <FormLabel className="font-normal">2 Dogs <span className="text-muted-foreground text-sm">(2 points)</span></FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="3" /></FormControl>
                          <FormLabel className="font-normal">3 Dogs <span className="text-muted-foreground text-sm">(3 points)</span></FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="more" /></FormControl>
                          <FormLabel className="font-normal">More Than 3 Dogs <span className="text-muted-foreground text-sm">(3 pts + 1/extra dog)</span></FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showNumMoreDogs && (
                <FormField
                  control={control}
                  name="num_more_dogs"
                  render={({ field }) => (
                    <FormItem className="pl-8">
                      <FormLabel>Total number of dogs</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 4" {...field} onChange={event => field.onChange(+event.target.value)} className="w-32" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Yard Size */}
              <FormField
                control={control}
                name="yard_size"
                render={({ field }) => (
                  <FormItem className="space-y-3 p-4 border rounded-md bg-card">
                    <FormLabel className="text-lg font-semibold text-primary">2. Yard Size</FormLabel>
                     <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="small" /></FormControl>
                          <FormLabel className="font-normal">Small (up to 0.15 acres) <span className="text-muted-foreground text-sm">(1 point)</span></FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="medium" /></FormControl>
                          <FormLabel className="font-normal">Medium (0.15 to 0.5 acres) <span className="text-muted-foreground text-sm">(2 points)</span></FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="large" /></FormControl>
                          <FormLabel className="font-normal">Large (0.5 to 1 acre) <span className="text-muted-foreground text-sm">(3 points)</span></FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="extralarge" /></FormControl>
                          <FormLabel className="font-normal">Extra Large (over 1 acre) <span className="text-muted-foreground text-sm">(3 pts + 2/extra acre)</span></FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showAcresExtraLarge && (
                <FormField
                  control={control}
                  name="acres_extralarge"
                  render={({ field }) => (
                    <FormItem className="pl-8">
                      <FormLabel>Approximate acreage</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 1.5" {...field} onChange={event => field.onChange(parseFloat(event.target.value))} className="w-32" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Yard Accessibility */}
              <FormField
                control={control}
                name="accessibility"
                render={({ field }) => (
                  <FormItem className="space-y-3 p-4 border rounded-md bg-card">
                    <FormLabel className="text-lg font-semibold text-primary">3. Yard Accessibility and Terrain</FormLabel>
                     <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="easy" /></FormControl>
                          <FormLabel className="font-normal">Easily accessible, flat yard <span className="text-muted-foreground text-sm">(0 points)</span></FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="minor" /></FormControl>
                          <FormLabel className="font-normal">Minor obstacles, gentle slopes <span className="text-muted-foreground text-sm">(1 point)</span></FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="difficult" /></FormControl>
                          <FormLabel className="font-normal">Significant obstacles, steep slopes, or difficult access <span className="text-muted-foreground text-sm">(3 points)</span></FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Visit Type */}
              <FormField
                control={control}
                name="visit_type"
                render={({ field }) => (
                  <FormItem className="space-y-3 p-4 border rounded-md bg-card">
                    <FormLabel className="text-lg font-semibold text-primary">4. Visit Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="onetime" /></FormControl>
                          <FormLabel className="font-normal">One-time Cleanup <span className="text-muted-foreground text-sm">(Base 10 pts)</span></FormLabel>
                        </FormItem>
                         <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="initial_recurring" /></FormControl>
                          <FormLabel className="font-normal">Initial Cleanup (for new Recurring Service)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="regular_recurring" /></FormControl>
                          <FormLabel className="font-normal">Regular Recurring Visit</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="second_weekly" /></FormControl>
                          <FormLabel className="font-normal">Second Weekly Visit (if on Weekly plan) <span className="text-muted-foreground text-sm">(Base 1 pt)</span></FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Recurring Frequency (Conditional) */}
              {showRecurringFrequency && (
                <FormField
                  control={control}
                  name="recurring_freq"
                  render={({ field }) => (
                    <FormItem className="space-y-3 p-4 border rounded-md bg-muted/50 ml-4">
                      <FormLabel className="text-md font-semibold text-primary">Select Recurring Frequency</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="weekly" /></FormControl>
                            <FormLabel className="font-normal">Weekly <span className="text-muted-foreground text-sm">(Base 2 pts)</span></FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="biweekly" /></FormControl>
                            <FormLabel className="font-normal">Bi-weekly <span className="text-muted-foreground text-sm">(Base 4 pts)</span></FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="monthly" /></FormControl>
                            <FormLabel className="font-normal">Monthly <span className="text-muted-foreground text-sm">(Base 7 pts)</span></FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Initial Cleanup Condition (Conditional) */}
              {showInitialConditionSection && (
                <FormField
                  control={control}
                  name="initial_condition"
                  render={({ field }) => (
                    <FormItem className="space-y-3 p-4 border rounded-md bg-card">
                      <FormLabel className="text-lg font-semibold text-primary">5. Initial Cleanup Condition</FormLabel>
                      <FormDescription>Assess the level of accumulated waste for this One-time or Initial Recurring visit.</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="recent" /></FormControl>
                            <FormLabel className="font-normal">Recent accumulation (within 1-2 weeks) <span className="text-muted-foreground text-sm">(0 points)</span></FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="moderate" /></FormControl>
                            <FormLabel className="font-normal">Moderate accumulation (2-4 weeks) <span className="text-muted-foreground text-sm">(3 points)</span></FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="heavy" /></FormControl>
                            <FormLabel className="font-normal">Heavy accumulation (over 1 month) <span className="text-muted-foreground text-sm">(Assess: 6-10 pts)</span></FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {showHeavyConditionPoints && (
                 <FormField
                  control={control}
                  name="heavy_points"
                  render={({ field }) => (
                    <FormItem className="pl-8">
                      <FormLabel>Assigned points for Heavy Accumulation</FormLabel>
                      <FormControl>
                        <Input type="number" min="6" max="10" placeholder="6-10" {...field} onChange={event => field.onChange(+event.target.value)} className="w-32"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Additional Services */}
                <div className="p-4 border rounded-md bg-card space-y-3">
                    <Label className="text-lg font-semibold text-primary">Additional Services (Optional)</Label>
                    <FormDescription>Check any services for THIS visit.</FormDescription>
                    <FormField
                        control={form.control}
                        name="addon_deodorizing"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel className="font-normal">
                                Yard Deodorizing treatment <span className="text-muted-foreground text-sm">(2 points)</span>
                            </FormLabel>
                            </div>
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="addon_disposal"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel className="font-normal">
                                Waste removal and disposal off-site <span className="text-muted-foreground text-sm">(1 point)</span>
                            </FormLabel>
                            </div>
                        </FormItem>
                        )}
                    />
                </div>
              
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
                <Calculator className="mr-2 h-5 w-5" />
                {form.formState.isSubmitting ? 'Calculating...' : 'Calculate Points & Estimate'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {calculationResult && (
        <Card className="max-w-3xl mx-auto mt-8 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary mb-2">
                <PawPrint className="w-7 h-7"/>
                <CardTitle className="text-2xl">Quote Calculation Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/90">
            <p>Points from Dogs: <span className="font-semibold text-primary">{calculationResult.dogs}</span></p>
            <p>Points from Yard Size: <span className="font-semibold text-primary">{calculationResult.yard}</span></p>
            <p>Points from Accessibility: <span className="font-semibold text-primary">{calculationResult.access}</span></p>
            <p>Points from Visit Type / Base Frequency: <span className="font-semibold text-primary">{calculationResult.frequency}</span></p>
            {(calculationResult.initial > 0 || showInitialConditionSection) && (
              <p>Points from Initial Cleanup Condition: <span className="font-semibold text-primary">{calculationResult.initial}</span></p>
            )}
            {calculationResult.addons > 0 && (
              <p>Points from Additional Services: <span className="font-semibold text-primary">{calculationResult.addons}</span></p>
            )}
            <p className="text-xl font-bold border-t pt-3 mt-3">
              TOTAL POINTS for THIS Visit: <span className="text-accent">{calculationResult.total}</span>
            </p>

            <div className="mt-6 pt-4 border-t">
              <h3 className="text-xl font-semibold text-primary mb-2">Pricing Guidance</h3>
              <p className="text-muted-foreground mb-3">
                This is an estimate. Final price may vary based on actual conditions. 
                Refer to your established Pricing Tiers based on the total points.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm bg-muted/30 p-4 rounded-md">
                <li>3 - 5 Total Points: Approx. $25 - $35 per visit</li>
                <li>6 - 10 Total Points: Approx. $35 - $50 per visit</li>
                <li>11 - 16 Total Points: Approx. $50 - $70 per visit</li>
                <li>17 - 24 Total Points: Approx. $70 - $95 per visit</li>
                <li>25+ Total Points: Custom Quote Required</li>
              </ul>
               <p className="mt-4 text-center">
                <Button asChild>
                  <a href="/#contact">Contact Us to Finalize or Book</a>
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

