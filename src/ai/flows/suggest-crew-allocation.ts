
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
    inputSchema: z.object({
        tenantId: z.string().describe("The ID of the tenant to search for crew within.")
    }),
    outputSchema: z.array(z.object({
        name: z.string(),
        rank: z.string(),
        certifications: z.array(z.string()).optional(),
    })),
  },
  async ({ tenantId }) => {
    const allCrew = await getCrew(tenantId);
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
  // We need to pass the tenantId to the tool, but we don't want to expose it in the public-facing schema.
  // This is a placeholder for getting the tenant context on the server.
  const tenantId = "Global Maritime"; 
  
  const suggestCrewAllocationFlow = ai.defineFlow(
    {
      name: 'suggestCrewAllocationFlow',
      inputSchema: SuggestCrewAllocationInputSchema,
      outputSchema: SuggestCrewAllocationOutputSchema,
    },
    async (flowInput) => {
      const { output } = await ai.generate({
        prompt: `You are an expert fleet manager specializing in optimizing crew allocation for vessels.

        Your first step is to call the \`findAvailableCrew\` tool to get a list of all available crew members and their certifications for the tenant ID: ${tenantId}.

        Then, using the provided information about the route, vessel, and vessel requirements, suggest the optimal crew allocation from the list of available crew you retrieved.

        Route: ${flowInput.route}
        Vessel: ${flowInput.vessel}
        Vessel Requirements: ${flowInput.vesselRequirements.join(', ')}

        Consider crew availability, certifications, and vessel requirements to make informed decisions and minimize operational costs. Provide a detailed reasoning for your suggested allocation.
        Your final output should be formatted as JSON.
        `,
        tools: [findAvailableCrew],
        output: { schema: SuggestCrewAllocationOutputSchema }
      });
      return output!;
    }
  );

  return suggestCrewAllocationFlow(input);
}
