'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal crew allocations for a given route and vessel.
 *
 * - suggestCrewAllocation - A function that handles the crew allocation suggestion process.
 * - SuggestCrewAllocationInput - The input type for the suggestCrewAllocation function.
 * - SuggestCrewAllocationOutput - The return type for the suggestCrewAllocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCrewAllocationInputSchema = z.object({
  route: z.string().describe('The route for which crew allocation is needed.'),
  vessel: z.string().describe('The vessel for which crew allocation is needed.'),
  availableCrew: z
    .array(z.string())
    .describe('List of available crew members.'),
  crewCertifications: z
    .record(z.array(z.string()))
    .describe('A record of crew member certifications'),
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
  prompt: `You are an expert fleet manager specializing in optimizing crew allocation for vessels.

  Given the following information about the route, vessel, available crew, and vessel requirements, suggest the optimal crew allocation.

  Route: {{{route}}}
Vessel: {{{vessel}}}
Available Crew: {{#each availableCrew}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Crew Certifications: {{#each crewCertifications}}{{{@key}}}: {{#each this}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}\n{{/each}}
Vessel Requirements: {{#each vesselRequirements}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Consider crew availability, certifications, and vessel requirements to make informed decisions and minimize operational costs. Provide a detailed reasoning for your suggested allocation.
  Output should be formatted as JSON.
  {
    "suggestedCrew": ["crewMember1", "crewMember2"],
    "reasoning": "Detailed explanation of the allocation decision."
  }
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
