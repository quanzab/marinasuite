'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal crew allocations for a given route and vessel.
 * It uses a tool to find available crew members.
 * - suggestCrewAllocation - A function that handles the crew allocation suggestion process.
 * - SuggestCrewAllocationInput - The input type for the suggestCrewAllocation function.
 * - SuggestCrewAllocationOutput - The return type for the suggestCrewAllocation function.
 */

import {ai} from '@/ai/genkit';
import {getCrew} from '@/lib/firestore';
import {z} from 'genkit';

const findAvailableCrew = ai.defineTool(
  {
    name: 'findAvailableCrew',
    description: 'Returns a list of all crew members who are currently active and unassigned to any vessel.',
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({
        name: z.string(),
        rank: z.string(),
        certifications: z.array(z.string()).optional(),
    })),
  },
  async () => {
    const allCrew = await getCrew();
    return allCrew.filter(c => c.status === 'Active' && !c.assignedVessel);
  }
)


const SuggestCrewAllocationInputSchema = z.object({
  route: z.string().describe('The route for which crew allocation is needed.'),
  vessel: z.string().describe('The vessel for which crew allocation is needed.'),
  vesselRequirements: z
    .array(z.string())
    .describe('List of certifications required for the vessel.'),
});
export type SuggestCrewAllocationInput = z.infer<
  typeof SuggestCrewAllocationInputSchema
>;

const SuggestCrewAllocationOutputSchema = z.object({
  suggestedCrew: z
    .array(z.string())
    .describe('The suggested crew allocation for the route and vessel.'),
  reasoning: z
    .string()
    .describe('The detailed reasoning behind the suggested allocation.'),
});
export type SuggestCrewAllocationOutput = z.infer<
  typeof SuggestCrewAllocationOutputSchema
>;

export async function suggestCrewAllocation(
  input: SuggestCrewAllocationInput
): Promise<SuggestCrewAllocationOutput> {
  return suggestCrewAllocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCrewAllocationPrompt',
  input: {schema: SuggestCrewAllocationInputSchema},
  output: {schema: SuggestCrewAllocationOutputSchema},
  tools: [findAvailableCrew],
  prompt: `You are an expert fleet manager specializing in optimizing crew allocation for vessels.

  Your first step is to call the \`findAvailableCrew\` tool to get a list of all available crew members and their certifications.

  Then, using the provided information about the route, vessel, and vessel requirements, suggest the optimal crew allocation from the list of available crew you retrieved.

  Route: {{{route}}}
  Vessel: {{{vessel}}}
  Vessel Requirements: {{#each vesselRequirements}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Consider crew availability, certifications, and vessel requirements to make informed decisions and minimize operational costs. Provide a detailed reasoning for your suggested allocation.
  Your final output should be formatted as JSON.
  `,
});

const suggestCrewAllocationFlow = ai.defineFlow(
  {
    name: 'suggestCrewAllocationFlow',
    inputSchema: SuggestCrewAllocationInputSchema,
    outputSchema: SuggestCrewAllocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
