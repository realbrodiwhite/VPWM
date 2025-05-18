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
        customerName: z.string().describe('The name of the customer.'),
        address: z.string().describe('The service address for the appointment.'),
        serviceTime: z.number().describe('The duration of the service in minutes.'),
        priority: z.enum(['high', 'medium', 'low']).describe('The priority of the appointment.'),
      })
    )
    .describe('A list of scheduled appointments, including customer name, address, and service time.'),
  currentLocation: z.string().describe('The current location of the service vehicle.'),
});
export type SuggestOptimizedRoutesInput = z.infer<typeof SuggestOptimizedRoutesInputSchema>;

const SuggestOptimizedRoutesOutputSchema = z.object({
  optimizedRoutes: z
    .array(
      z.object({
        customerName: z.string().describe('The name of the customer.'),
        address: z.string().describe('The service address for the appointment.'),
        serviceTime: z.number().describe('The duration of the service in minutes.'),
        priority: z.enum(['high', 'medium', 'low']).describe('The priority of the appointment.'),
      })
    )
    .describe('An optimized list of appointments, sorted by the most efficient route.'),
  totalTravelTime: z.number().describe('The estimated total travel time in minutes for the optimized route.'),
  totalFuelConsumption: z
    .number()
    .describe('The estimated total fuel consumption in liters for the optimized route.'),
});
export type SuggestOptimizedRoutesOutput = z.infer<typeof SuggestOptimizedRoutesOutputSchema>;

export async function suggestOptimizedRoutes(input: SuggestOptimizedRoutesInput): Promise<SuggestOptimizedRoutesOutput> {
  return suggestOptimizedRoutesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimizedRoutesPrompt',
  input: {schema: SuggestOptimizedRoutesInputSchema},
  output: {schema: SuggestOptimizedRoutesOutputSchema},
  prompt: `You are an expert route optimization specialist.

You are provided with a list of scheduled appointments, the current location of the service vehicle, and you will suggest the most efficient service routes to minimize travel time and fuel consumption.

Appointments:
{{#each appointments}}
- Customer: {{customerName}}, Address: {{address}}, Service Time: {{serviceTime}} minutes, Priority: {{priority}}
{{/each}}

Current Location: {{currentLocation}}

Consider the priority of the appointments and optimize the route accordingly. The route should start from the current location.

Return the optimized routes, total travel time in minutes, and total fuel consumption in liters.`,
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
