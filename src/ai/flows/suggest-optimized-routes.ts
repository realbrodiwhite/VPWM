
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

// This file is no longer used by the primary scheduling logic on the Smart Routes page
// if the non-AI scheduler is preferred.
// However, it's kept here in case you want to switch back or use AI for other purposes.

const SuggestOptimizedRoutesInputSchema = z.object({
  appointments: z
    .array(
      z.object({
        customerName: z.string().describe('The name of the customer or task (e.g., "Lunch Break").'),
        address: z.string().describe('The service address for the appointment or location of the task/break.'),
        serviceTime: z.number().describe('The duration of the service or task in minutes. This includes any on-site setup and cleanup time for jobs.'),
        priority: z.enum(['high', 'medium', 'low']).describe('The priority of the appointment/task.'),
      })
    )
    .describe('A list of scheduled appointments or tasks, including customer/task name, address, total on-site service/task time, and priority.'),
  currentLocation: z.string().describe('The current location of the service vehicle (e.g., address or GPS coordinates).'),
});
export type SuggestOptimizedRoutesInput = z.infer<typeof SuggestOptimizedRoutesInputSchema>;

const SuggestOptimizedRoutesOutputSchema = z.object({
  optimizedRoutes: z
    .array(
      z.object({
        customerName: z.string().describe('The name of the customer or task.'),
        address: z.string().describe('The service address for the appointment or location of the task.'),
        serviceTime: z.number().describe('The duration of the service or task in minutes (including setup/cleanup for jobs).'),
        priority: z.enum(['high', 'medium', 'low']).describe('The priority of the appointment/task.'),
        travelTimeToThisStop: z.number().optional().describe('Estimated travel time in minutes to this stop from the previous one, or from the current location for the first stop. This field might be omitted if travel time cannot be determined or is zero (e.g., for the first stop if it is at the current location).'),
      })
    )
    .describe('An optimized list of appointments/tasks, sorted by the most efficient route, including estimated travel time to each stop.'),
  totalTravelTime: z.number().describe('The estimated total travel time in minutes for the optimized route.'),
  totalFuelConsumption: z
    .number()
    .describe('The estimated total fuel consumption in liters for the optimized route.'),
});
export type SuggestOptimizedRoutesOutput = z.infer<typeof SuggestOptimizedRoutesOutputSchema>;

export async function suggestOptimizedRoutes(input: SuggestOptimizedRoutesInput): Promise<SuggestOptimizedRoutesOutput> {
  // console.warn("AI Route Optimization (suggestOptimizedRoutes) is being called. If you intended to use the simplified non-AI scheduler, this might be unexpected.");
  return suggestOptimizedRoutesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimizedRoutesPrompt',
  input: {schema: SuggestOptimizedRoutesInputSchema},
  output: {schema: SuggestOptimizedRoutesOutputSchema},
  prompt: `You are an expert route optimization specialist.

You are provided with a list of scheduled appointments/tasks, and the current location of the service vehicle. The 'serviceTime' for each appointment already includes any necessary on-site work time, setup, and cleanup.

Your goal is to suggest the most efficient service routes to minimize travel time and fuel consumption.

Appointments/Tasks:
{{#each appointments}}
- Task/Customer: {{customerName}}, Address: {{address}}, On-site Duration: {{serviceTime}} minutes, Priority: {{priority}}
{{/each}}

Current Vehicle Location: {{currentLocation}}

Consider the priority of the appointments/tasks and optimize the route accordingly. The route should start from the current vehicle location.

For each stop in the optimized route, you MUST estimate the travel time in minutes to reach that stop from the previous stop (or from the current vehicle location for the first stop). Include this as 'travelTimeToThisStop'.

Return the optimized routes (including customer/task name, address, on-site service/task duration, priority, and estimated travel time to this stop), total overall travel time in minutes, and total fuel consumption in liters.`,
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

    