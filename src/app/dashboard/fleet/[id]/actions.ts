'use server';

import { generateVesselImage } from '@/ai/flows/generate-vessel-image-flow';
import { getVesselById, updateVessel } from '@/lib/firestore';
import { revalidatePath } from 'next/cache';

export async function generateNewImageAction(vesselId: string) {
  try {
    const vessel = await getVesselById(vesselId);
    if (!vessel) {
      throw new Error('Vessel not found');
    }

    const result = await generateVesselImage({
      vesselName: vessel.name,
      vesselType: vessel.type,
    });
    
    if (result.imageUrl) {
        await updateVessel(vesselId, { imageUrl: result.imageUrl });
    }

    revalidatePath(`/dashboard/fleet/${vesselId}`);

    return { success: true, imageUrl: result.imageUrl };
  } catch (error) {
    console.error('Error generating image:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: message };
  }
}
