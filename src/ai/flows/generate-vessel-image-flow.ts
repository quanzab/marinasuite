'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a vessel image.
 *
 * - generateVesselImage - A function that handles the image generation process.
 * - GenerateVesselImageInput - The input type for the generateVesselImage function.
 * - GenerateVesselImageOutput - The return type for the generateVesselImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVesselImageInputSchema = z.object({
  vesselName: z.string().describe('The name of the vessel.'),
  vesselType: z.string().describe('The type of vessel (e.g., Container Ship, Tanker).'),
});
export type GenerateVesselImageInput = z.infer<typeof GenerateVesselImageInputSchema>;

const GenerateVesselImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateVesselImageOutput = z.infer<typeof GenerateVesselImageOutputSchema>;

export async function generateVesselImage(input: GenerateVesselImageInput): Promise<GenerateVesselImageOutput> {
  return generateVesselImageFlow(input);
}

const generateVesselImageFlow = ai.defineFlow(
  {
    name: 'generateVesselImageFlow',
    inputSchema: GenerateVesselImageInputSchema,
    outputSchema: GenerateVesselImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A cinematic, photorealistic image of a ${input.vesselType} named "${input.vesselName}" sailing on the open ocean during a bright, sunny day.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to produce an image.');
    }

    return {imageUrl: media.url};
  }
);
