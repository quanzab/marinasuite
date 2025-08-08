'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting an optimal shipping route.
 *
 * - suggestRoute - A function that handles the route suggestion process.
 * - SuggestRouteInput - The input type for the suggestRoute function.
 * - SuggestRouteOutput - The return type for the suggestRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRouteInputSchema = z.object({
  startPort: z.string().describe('The starting port of the journey.'),
  endPort: z.string().describe('The destination port of the journey.'),
  vesselType: z.string().describe('The type of vessel being used (e.g., Container Ship, Tanker).'),
});
export type SuggestRouteInput = z.infer<typeof SuggestRouteInputSchema>;

const SuggestRouteOutputSchema = z.object({
  suggestedRoute: z.string().describe('A summary of the suggested route, including key waypoints.'),
  reasoning: z.string().describe('The detailed reasoning for the suggested route, considering factors like currents, weather, and typical traffic.'),
  estimatedDuration: z.string().describe('The estimated travel time in days.'),
  potentialRisks: z.string().describe('A summary of potential risks or challenges along the route (e.g., piracy zones, weather patterns).'),
});
export type SuggestRouteOutput = z.infer<typeof SuggestRouteOutputSchema>;

export async function suggestRoute(input: SuggestRouteInput): Promise<SuggestRouteOutput> {
  return suggestRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRoutePrompt',
  input: {schema: SuggestRouteInputSchema},
  output: {schema: SuggestRouteOutputSchema},
  prompt: `You are an expert maritime logistics and navigation AI. Your task is to provide an optimal shipping route suggestion.

  Analyze the provided start port, end port, and vessel type to generate the most efficient and safe route.

  Start Port: {{{startPort}}}
  End Port: {{{endPort}}}
  Vessel Type: {{{vesselType}}}

  Your response should include:
  1.  A concise summary of the suggested route with major waypoints (e.g., "via Suez Canal, Strait of Malacca").
  2.  Detailed reasoning for your choice, considering prevailing ocean currents, seasonal weather patterns, common traffic lanes, and any relevant geopolitical factors.
  3.  An estimated duration for the journey in days, based on the vessel type.
  4.  A list of potential risks or challenges, such as piracy-prone areas, iceberg zones, or regions with historically adverse weather.

  Provide the output in a structured JSON format.
  `,
});

const suggestRouteFlow = ai.defineFlow(
  {
    name: 'suggestRouteFlow',
    inputSchema: SuggestRouteInputSchema,
    outputSchema: SuggestRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
