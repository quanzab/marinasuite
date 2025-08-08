
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a sea shanty about a vessel.
 *
 * - generateShanty - A function that handles the shanty generation process.
 * - GenerateShantyInput - The input type for the generateShanty function.
 * - GenerateShantyOutput - The return type for the generateShanty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShantyInputSchema = z.object({
  vesselName: z.string().describe('The name of the vessel for the shanty.'),
});
export type GenerateShantyInput = z.infer<typeof GenerateShantyInputSchema>;

const GenerateShantyOutputSchema = z.object({
  title: z.string().describe('The title of the sea shanty.'),
  shanty: z.string().describe('The full lyrics of the generated sea shanty, with verses and a chorus. Should include markdown for formatting and speaker prefixes (e.g., "Speaker1: ...") for TTS.'),
});
export type GenerateShantyOutput = z.infer<typeof GenerateShantyOutputSchema>;

export async function generateShanty(input: GenerateShantyInput): Promise<GenerateShantyOutput> {
  return generateShantyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShantyPrompt',
  input: {schema: GenerateShantyInputSchema},
  output: {schema: GenerateShantyOutputSchema},
  prompt: `You are a master sea shanty writer. Your task is to compose a rousing and creative sea shanty about a vessel.

  The name of the vessel is: **{{{vesselName}}}**

  Please create a shanty with the following structure:
  1.  A catchy, memorable title.
  2.  At least three verses that tell a short story or describe the character of the ship.
  3.  A repeating chorus that is easy to sing along to.

  The tone should be adventurous, and optimistic. Use classic sea shanty themes like wind, waves, far-off lands, and the camaraderie of the crew.

  IMPORTANT: You must format the lyrics for a multi-speaker Text-to-Speech (TTS) model. Each line must be prefixed with either "Speaker1: " or "Speaker2: " to create a call-and-response effect. Alternate between speakers for each line.

  Example Format:
  Speaker1: The waves are high, the winds do blow,
  Speaker2: Heave ho, me lads, heave ho!
  Speaker1: To distant shores we're bound to go,
  Speaker2: Heave ho, me lads, heave ho!

  Format the final output as a JSON object, with the shanty lyrics using markdown for verses and chorus (e.g., bold for chorus) and the required speaker prefixes.
  `,
});

const generateShantyFlow = ai.defineFlow(
  {
    name: 'generateShantyFlow',
    inputSchema: GenerateShantyInputSchema,
    outputSchema: GenerateShantyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
