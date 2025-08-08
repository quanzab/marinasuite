
'use server';

import { generateVesselImage } from '@/ai/flows/generate-vessel-image-flow';
import { generateVesselVideo } from '@/ai/flows/generate-vessel-video-flow';
import { getVesselById, updateVessel, addMaintenanceRecord } from '@/lib/firestore';
import type { MaintenanceLogFormValues } from '@/lib/types';
import { format } from 'date-fns';
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

export async function generateNewVideoAction(vesselId: string) {
  try {
    const vessel = await getVesselById(vesselId);
    if (!vessel) {
      throw new Error('Vessel not found');
    }

    const result = await generateVesselVideo({
      vesselName: vessel.name,
      vesselType: vessel.type,
      imageUrl: vessel.imageUrl || undefined,
    });
    
    if (result.videoDataUri) {
        await updateVessel(vesselId, { videoUrl: result.videoDataUri });
    }

    revalidatePath(`/dashboard/fleet/${vesselId}`);

    return { success: true, videoUrl: result.videoDataUri };
  } catch (error) {
    console.error('Error generating video:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: message };
  }
}


export async function logMaintenanceAction(vesselId: string, data: MaintenanceLogFormValues) {
    try {
        const record = {
            date: format(data.date, 'yyyy-MM-dd'),
            description: data.description,
        };
        await addMaintenanceRecord(vesselId, record);
        revalidatePath(`/dashboard/fleet/${vesselId}`);
        return { success: true };
    } catch (error) {
        console.error('Error logging maintenance:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, error: message };
    }
}

    