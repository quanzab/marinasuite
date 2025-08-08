
'use server';
/**
 * @fileOverview This file defines a Genkit flow for converting shanty text to speech.
 *
 * - generateShantyAudio - A function that handles the text-to-speech process.
 * - GenerateShantyAudioInput - The input type for the function.
 * - GenerateShantyAudioOutput - The return type for the function.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';

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

    const bufs: any[] = [];
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

const GenerateShantyAudioInputSchema = z.object({
  shantyText: z.string().describe("The sea shanty text to be converted to speech."),
});
export type GenerateShantyAudioInput = z.infer<typeof GenerateShantyAudioInputSchema>;

const GenerateShantyAudioOutputSchema = z.object({
  audioDataUri: z.string().describe("The data URI of the generated audio file."),
});
export type GenerateShantyAudioOutput = z.infer<typeof GenerateShantyAudioOutputSchema>;

export async function generateShantyAudio(input: GenerateShantyAudioInput): Promise<GenerateShantyAudioOutput> {
    return generateShantyAudioFlow(input);
}


const generateShantyAudioFlow = ai.defineFlow(
  {
    name: 'generateShantyAudioFlow',
    inputSchema: GenerateShantyAudioInputSchema,
    outputSchema: GenerateShantyAudioOutputSchema,
  },
  async ({ shantyText }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Calypso' }, // A voice that might sound good for a shanty
          },
        },
      },
      prompt: shantyText,
    });

    if (!media) {
      throw new Error('No media was returned from the TTS model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
