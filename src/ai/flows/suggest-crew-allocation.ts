
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal crew allocations for a given route and vessel.
 * It uses a tool to find available and qualified crew members.
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
    description: 'Returns a list of all crew members who are currently active, unassigned, and meet the specified certification requirements.',
    inputSchema: z.object({
        tenantId: z.string().describe("The ID of the tenant to search for crew within."),
        requiredCerts: z.array(z.string()).optional().describe("An optional list of certifications that the crew must possess."),
    }),
    outputSchema: z.array(z.object({
        name: z.string(),
        rank: z.string(),
        certifications: z.array(z.string()).optional(),
    })),
  },
  async ({ tenantId, requiredCerts }) => {
    const allCrew = await getCrew(tenantId);
    const availableCrew = allCrew.filter(c => c.status === 'Active' && !c.assignedVessel);

    if (requiredCerts && requiredCerts.length > 0) {
      return availableCrew.filter(c => 
        requiredCerts.every(reqCert => c.certifications?.includes(reqCert))
      );
    }
    
    return availableCrew;
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
  input: SuggestCrewAllocationInput,
  tenantId: string,
): Promise<SuggestCrewAllocationOutput> {
  
  const suggestCrewAllocationFlow = ai.defineFlow(
    {
      name: 'suggestCrewAllocationFlow',
      inputSchema: SuggestCrewAllocationInputSchema,
      outputSchema: SuggestCrewAllocationOutputSchema,
    },
    async (flowInput) => {
      const { output } = await ai.generate({
        prompt: `You are an expert fleet manager specializing in optimizing crew allocation for vessels.

        Your first step is to call the \`findAvailableCrew\` tool to get a list of all available crew members for the tenant ID: ${tenantId}. 
        Crucially, you MUST pass the list of required certifications to the tool to get a pre-filtered list of qualified candidates.

        Then, using the provided information and the list of qualified crew you retrieved, suggest the optimal crew allocation.

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
