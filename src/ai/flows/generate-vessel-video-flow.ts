
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a vessel video.
 *
 * - generateVesselVideo - A function that handles the video generation process.
 * - GenerateVesselVideoInput - The input type for the generateVesselVideo function.
 * - GenerateVesselVideoOutput - The return type for the generateVesselVideo function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import { MediaPart } from 'genkit/model';

const GenerateVesselVideoInputSchema = z.object({
  vesselName: z.string().describe('The name of the vessel.'),
  vesselType: z.string().describe('The type of vessel (e.g., Container Ship, Tanker).'),
  imageUrl: z.string().optional().describe('An optional image of the vessel to animate, as a data URI.'),
});
export type GenerateVesselVideoInput = z.infer<typeof GenerateVesselVideoInputSchema>;

const GenerateVesselVideoOutputSchema = z.object({
  videoDataUri: z.string().describe('The data URI of the generated video.'),
});
export type GenerateVesselVideoOutput = z.infer<typeof GenerateVesselVideoOutputSchema>;

export async function generateVesselVideo(input: GenerateVesselVideoInput): Promise<GenerateVesselVideoOutput> {
  return generateVesselVideoFlow(input);
}


const generateVesselVideoFlow = ai.defineFlow(
  {
    name: 'generateVesselVideoFlow',
    inputSchema: GenerateVesselVideoInputSchema,
    outputSchema: GenerateVesselVideoOutputSchema,
  },
  async (input) => {
    let prompt: (string | MediaPart)[] = [
        { text: `A cinematic, photorealistic video of a ${input.vesselType} named "${input.vesselName}" sailing on the open ocean during a bright, sunny day.`}
    ];

    if (input.imageUrl) {
        prompt.push({ media: { url: input.imageUrl, contentType: 'image/png' }});
        prompt[0] = { text: `Make this image of a ${input.vesselType} named "${input.vesselName}" come to life. The vessel should be sailing on the open ocean.`}
    }


    let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: prompt,
        config: {
            durationSeconds: 5,
            aspectRatio: '16:9',
        },
    });

    if (!operation) {
        throw new Error('Expected the model to return an operation');
    }

    while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
        throw new Error('Failed to generate video: ' + operation.error.message);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media) {
        throw new Error('Failed to find the generated video in the operation result');
    }

    // Since we can't do a direct fetch with API key on the client easily,
    // and to avoid exposing API keys, we'll fetch it server-side and convert to a data URI.
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
        `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
    );

    if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
        throw new Error(`Failed to fetch video: ${videoDownloadResponse.statusText}`);
    }

    const videoBuffer = await videoDownloadResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    
    return {
        videoDataUri: `data:video/mp4;base64,${videoBase64}`,
    };
  }
);

    