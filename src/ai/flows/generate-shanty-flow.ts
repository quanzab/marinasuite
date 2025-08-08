'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a sea shanty about a vessel, including audio.
 *
 * - generateShanty - A function that handles the shanty generation process.
 * - GenerateShantyInput - The input type for the generateShanty function.
 * - GenerateShantyOutput - The return type for the generateShanty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';


const GenerateShantyInputSchema = z.object({
  vesselName: z.string().describe('The name of the vessel for the shanty.'),
});
export type GenerateShantyInput = z.infer<typeof GenerateShantyInputSchema>;

const GenerateShantyOutputSchema = z.object({
  title: z.string().describe('The title of the sea shanty.'),
  shanty: z.string().describe('The full lyrics of the generated sea shanty, with verses and a chorus. Should include markdown for formatting.'),
  audioDataUri: z.string().describe('The generated audio of the shanty as a data URI.'),
});
export type GenerateShantyOutput = z.infer<typeof GenerateShantyOutputSchema>;

export async function generateShanty(input: GenerateShantyInput): Promise<GenerateShantyOutput> {
  return generateShantyFlow(input);
}

const lyricsPrompt = ai.definePrompt({
  name: 'generateShantyLyricsPrompt',
  input: {schema: GenerateShantyInputSchema},
  output: {schema: z.object({
      title: z.string().describe('The title of the sea shanty.'),
      shanty: z.string().describe('The full lyrics of the generated sea shanty, with verses and a chorus. Should include markdown for formatting.'),
    })
  },
  prompt: `You are a master sea shanty writer. Your task is to compose a rousing and creative sea shanty about a vessel.

  The name of the vessel is: **{{{vesselName}}}**

  Please create a shanty with the following structure:
  1.  A catchy, memorable title.
  2.  At least three verses that tell a short story or describe the character of the ship.
  3.  A repeating chorus that is easy to sing along to.

  The tone should be adventurous, and optimistic. Use classic sea shanty themes like wind, waves, far-off lands, and the camaraderie of the crew.

  Format the output as a JSON object, with the shanty lyrics using markdown for verses and chorus (e.g., bold for chorus).
  `,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


const generateShantyFlow = ai.defineFlow(
  {
    name: 'generateShantyFlow',
    inputSchema: GenerateShantyInputSchema,
    outputSchema: GenerateShantyOutputSchema,
  },
  async input => {
    const { output: lyrics } = await lyricsPrompt(input);
    if (!lyrics) {
        throw new Error('Failed to generate shanty lyrics.');
    }

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: lyrics.shanty.replace(/\*/g, ''), // Remove markdown for TTS
    });
    
    if (!media?.url) {
      throw new Error('Audio generation failed to produce a file.');
    }
    
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
        ...lyrics,
        audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
