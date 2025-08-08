'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing maritime safety reports.
 *
 * - analyzeSafetyReport - A function that handles the safety report analysis process.
 * - AnalyzeSafetyReportInput - The input type for the analyzeSafetyReport function.
 * - AnalyzeSafetyReportOutput - The return type for the analyzeSafetyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSafetyReportInputSchema = z.object({
  reportText: z.string().describe('The full text of the safety or incident report.'),
});
export type AnalyzeSafetyReportInput = z.infer<typeof AnalyzeSafetyReportInputSchema>;

const AnalyzeSafetyReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the incident described in the report.'),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The assessed risk level of the incident.'),
  keyFindings: z.array(z.string()).describe('A list of the most important findings or contributing factors.'),
  suggestedActions: z.array(z.string()).describe('A list of recommended corrective or preventative actions.'),
});
export type AnalyzeSafetyReportOutput = z.infer<typeof AnalyzeSafetyReportOutputSchema>;

export async function analyzeSafetyReport(input: AnalyzeSafetyReportInput): Promise<AnalyzeSafetyReportOutput> {
  return analyzeSafetyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSafetyReportPrompt',
  input: {schema: AnalyzeSafetyReportInputSchema},
  output: {schema: AnalyzeSafetyReportOutputSchema},
  prompt: `You are a maritime safety expert AI (MARS-AI). Your function is to analyze incident and safety reports to identify risks and recommend preventative measures.

  Analyze the following report:
  ---
  {{{reportText}}}
  ---

  Based on the report, provide the following in a structured JSON format:
  1.  **Summary**: A brief, clear summary of the event.
  2.  **Risk Level**: Assess the incident's severity and assign a risk level: 'Low', 'Medium', 'High', or 'Critical'.
  3.  **Key Findings**: A bulleted list of the primary causes and contributing factors.
  4.  **Suggested Actions**: A bulleted list of concrete, actionable steps to prevent recurrence.

  Your analysis should be objective, clear, and focused on improving maritime safety.
  `,
});

const analyzeSafetyReportFlow = ai.defineFlow(
  {
    name: 'analyzeSafetyReportFlow',
    inputSchema: AnalyzeSafetyReportInputSchema,
    outputSchema: AnalyzeSafetyReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
