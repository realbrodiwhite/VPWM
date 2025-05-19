
// src/ai/flows/suggest-optimized-routes.ts
'use server';

/**
 * @fileOverview An AI agent that suggests optimized service routes based on scheduled appointments.
 *
 * - suggestOptimizedRoutes - A function that handles the route optimization process.
 * - SuggestOptimizedRoutesInput - The input type for the suggestOptimizedRoutes function.
 * - SuggestOptimizedRoutesOutput - The return type for the suggestOptimizedRoutes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimizedRoutesInputSchema = z.object({
  appointments: z
    .array(
      z.object({
        customerName: z.string().describe('The name of the customer or task (e.g., "Lunch Break").'),
        address: z.string().describe('The service address for the appointment or location of the task/break.'),
        serviceTime: z.number().describe('The duration of the service or task in minutes. This includes any on-site setup and cleanup time for jobs, or the fixed duration for breaks.'),
        priority: z.enum(['high', 'medium', 'low']).describe('The priority of the appointment/task.'),
      })
    )
    .describe('A list of scheduled appointments or tasks, including customer/task name, address, total on-site service/task time, and priority.'),
  currentLocation: z.string().describe('The current location of the service vehicle (e.g., address or GPS coordinates).'),
  startOfDay: z.string().describe("The desired start time for the route in HH:MM format (e.g., 08:00). The first travel leg should begin at this time from the current vehicle location."),
});
export type SuggestOptimizedRoutesInput = z.infer<typeof SuggestOptimizedRoutesInputSchema>;

const SuggestOptimizedRoutesOutputSchema = z.object({
  optimizedRoutes: z
    .array(
      z.object({
        customerName: z.string().describe('The name of the customer or task.'),
        address: z.string().describe('The service address for the appointment or location of the task.'),
        serviceTime: z.number().describe('The duration of the service or task in minutes (including setup/cleanup for jobs or fixed break time).'),
        priority: z.enum(['high', 'medium', 'low']).describe('The priority of the appointment/task.'),
        travelTimeToThisStop: z.number().optional().describe('Estimated travel time in minutes to this stop from the previous one, or from the current location for the first stop. This field might be omitted if travel time cannot be determined or is zero (e.g., for the first stop if it is at the current location).'),
        estimatedStartTime: z.string().describe("Estimated start time for this stop in HH:MM format, after travel."),
        estimatedEndTime: z.string().describe("Estimated end time for this stop in HH:MM format, after service/task completion."),
      })
    )
    .describe('An optimized list of appointments/tasks, sorted by the most efficient route, including estimated travel time to each stop, and start/end times.'),
  totalTravelTime: z.number().describe('The estimated total travel time in minutes for the optimized route.'),
  totalFuelConsumption: z
    .number()
    .optional() // Making this optional as it's harder to reliably estimate without deep map integration
    .describe('The estimated total fuel consumption in liters for the optimized route. This field might be omitted if not determinable.'),
});
export type SuggestOptimizedRoutesOutput = z.infer<typeof SuggestOptimizedRoutesOutputSchema>;

export async function suggestOptimizedRoutes(input: SuggestOptimizedRoutesInput): Promise<SuggestOptimizedRoutesOutput> {
  return suggestOptimizedRoutesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimizedRoutesPrompt',
  input: {schema: SuggestOptimizedRoutesInputSchema},
  output: {schema: SuggestOptimizedRoutesOutputSchema},
  prompt: `You are an expert route optimization specialist and scheduler.

You are provided with:
1. A list of scheduled appointments/tasks. The 'serviceTime' for each appointment already includes any necessary on-site work time (setup, service, cleanup) or the fixed duration for breaks.
2. The current location of the service vehicle.
3. A desired 'startOfDay' time in HH:MM format.

Your goal is to:
1. Suggest the most efficient service routes to minimize travel time.
2. Consider the priority of the appointments/tasks and optimize the route accordingly.
3. The route should start from the 'currentVehicleLocation'. The travel to the first stop should begin at the specified 'startOfDay' time.
4. For EACH stop in the optimized route, you MUST:
    a. Estimate the 'travelTimeToThisStop' in minutes to reach that stop from the previous stop (or from 'currentVehicleLocation' for the first stop).
    b. Calculate the 'estimatedStartTime' (HH:MM format) for that stop, which is after the travel time.
    c. Calculate the 'estimatedEndTime' (HH:MM format) for that stop, which is 'estimatedStartTime' plus 'serviceTime'.
5. Return the optimized routes (including customer/task name, address, on-site service/task duration, priority, 'travelTimeToThisStop', 'estimatedStartTime', and 'estimatedEndTime').
6. Return the 'totalTravelTime' in minutes for the entire optimized route.
7. Optionally, estimate 'totalFuelConsumption' in liters if you have a reasonable basis for it.

Appointments/Tasks:
{{#each appointments}}
- Task/Customer: {{customerName}}, Address: {{address}}, On-site Duration: {{serviceTime}} minutes, Priority: {{priority}}
{{/each}}

Current Vehicle Location: {{currentLocation}}
Desired Start of Day Time: {{startOfDay}}

Ensure all times are in HH:MM format.
`,
});

const suggestOptimizedRoutesFlow = ai.defineFlow(
  {
    name: 'suggestOptimizedRoutesFlow',
    inputSchema: SuggestOptimizedRoutesInputSchema,
    outputSchema: SuggestOptimizedRoutesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
