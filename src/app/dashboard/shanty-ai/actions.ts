
"use server";

import { z } from "zod";
import { generateShanty, GenerateShantyOutput } from "@/ai/flows/generate-shanty-flow";
import { generateShantyAudio } from "@/ai/flows/generate-shanty-audio-flow";
import { getVessels } from "@/lib/firestore";
import { useTenant } from "@/hooks/use-tenant";

const formSchema = z.object({
    vesselId: z.string().min(1, "Vessel is required."),
    tenantId: z.string().min(1, "Tenant ID is required."),
});

type State = {
    data: GenerateShantyOutput | null;
    error: string | null;
    message: string;
    audioDataUri: string | null;
};

export async function getShanty(
    prevState: State,
    formData: FormData
): Promise<State> {
    const validatedFields = formSchema.safeParse({
        vesselId: formData.get("vesselId"),
        tenantId: formData.get("tenantId"),
    });

    if (!validatedFields.success) {
        return {
            data: null,
            error: JSON.stringify(validatedFields.error.flatten().fieldErrors),
            message: "Validation failed.",
            audioDataUri: null,
        };
    }

    const { vesselId, tenantId } = validatedFields.data;

    try {
        const allVessels = await getVessels(tenantId);
        const selectedVessel = allVessels.find(v => v.id === vesselId);

        if (!selectedVessel) {
            return { data: null, error: "Selected vessel not found.", message: "Error", audioDataUri: null };
        }

        const textResult = await generateShanty({
            vesselName: selectedVessel.name,
        });

        // Immediately return the text result to show the user
        // We trigger the audio generation but don't wait for it here
        // The client will poll or a more advanced solution would be used in a real app
        const audioPromise = generateShantyAudio({ shantyText: textResult.shanty });
        
        // In this simplified example, we'll await both.
        // In a real-world app, you might return the text first and then stream/load the audio.
        const audioResult = await audioPromise;

        return { 
            data: textResult, 
            error: null, 
            message: "Shanty and audio generated.",
            audioDataUri: audioResult.audioDataUri
        };
    } catch (e) {
        console.error(e);
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { data: null, error, message: "Failed to generate shanty.", audioDataUri: null };
    }
}
