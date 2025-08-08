'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting vessel maintenance needs.
 *
 * - predictMaintenance - A function that handles the maintenance prediction process.
 * - PredictMaintenanceInput - The input type for the predictMaintenance function.
 * - PredictMaintenanceOutput - The return type for the predictMaintenance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictMaintenanceInputSchema = z.object({
  vesselName: z.string().describe('The name of the vessel.'),
  vesselType: z.string().describe('The type of vessel (e.g., Container Ship, Tanker).'),
  vesselAge: z.number().describe('The age of the vessel in years.'),
  lastMaintenanceDate: z.string().describe('The date of the last maintenance (YYYY-MM-DD).'),
  operatingHours: z.number().describe('Total operating hours since last maintenance.'),
});
export type PredictMaintenanceInput = z.infer<typeof PredictMaintenanceInputSchema>;

const MaintenanceTaskSchema = z.object({
    task: z.string().describe("A specific maintenance task that is recommended."),
    urgency: z.enum(["High", "Medium", "Low"]).describe("The urgency level of the task."),
    reason: z.string().describe("The reason why this task is being recommended."),
});

const PredictMaintenanceOutputSchema = z.object({
  overallAssessment: z.string().describe('A high-level summary of the vessel\'s condition and primary concerns.'),
  predictedIssues: z.array(MaintenanceTaskSchema).describe('A list of predicted maintenance issues and recommended tasks.'),
  nextServiceDate: z.string().describe('The recommended date for the next major service (YYYY-MM-DD).'),
});
export type PredictMaintenanceOutput = z.infer<typeof PredictMaintenanceOutputSchema>;

export async function predictMaintenance(input: PredictMaintenanceInput): Promise<PredictMaintenanceOutput> {
  return predictMaintenanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictMaintenancePrompt',
  input: {schema: PredictMaintenanceInputSchema},
  output: {schema: PredictMaintenanceOutputSchema},
  prompt: `You are a predictive maintenance AI for maritime vessels, specializing in engine and hull integrity.

  Analyze the following vessel data to predict upcoming maintenance requirements.

  Vessel: {{{vesselName}}} ({{{vesselType}}})
  Age: {{{vesselAge}}} years
  Last Maintenance: {{{lastMaintenanceDate}}}
  Operating Hours Since Last Maintenance: {{{operatingHours}}}

  Based on the vessel's type, age, and operational history, provide:
  1.  An overall assessment of the vessel's likely condition.
  2.  A list of specific, actionable maintenance tasks, including their urgency and the reasoning behind the prediction (e.g., "propeller shaft alignment check," "hull coating inspection").
  3.  A recommended date for the next scheduled major service.

  Consider factors like typical wear and tear for the vessel type, engine stress based on operating hours, and potential for corrosion or fatigue based on age.

  Provide the output in a structured JSON format.
  `,
});

const predictMaintenanceFlow = ai.defineFlow(
  {
    name: 'predictMaintenanceFlow',
    inputSchema: PredictMaintenanceInputSchema,
    outputSchema: PredictMaintenanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
