
"use server";

import { z } from "zod";
import { suggestCrewAllocation, SuggestCrewAllocationInput, SuggestCrewAllocationOutput } from "@/ai/flows/suggest-crew-allocation";
import { getVessels } from "@/lib/firestore";

const formSchema = z.object({
    route: z.string().min(1, "Route is required."),
    vesselId: z.string().min(1, "Vessel is required."),
    tenantId: z.string().min(1, "Tenant ID is required."),
});

type State = {
    data: SuggestCrewAllocationOutput | null;
    error: string | null;
    message: string;
};

export async function getCrewSuggestion(
    prevState: State,
    formData: FormData
): Promise<State> {
    const validatedFields = formSchema.safeParse({
        route: formData.get("route"),
        vesselId: formData.get("vesselId"),
        tenantId: formData.get("tenantId"),
    });

    if (!validatedFields.success) {
        return {
            data: null,
            error: JSON.stringify(validatedFields.error.flatten().fieldErrors),
            message: "Validation failed.",
        };
    }

    const { route, vesselId, tenantId } = validatedFields.data;

    try {
        const allVessels = await getVessels(tenantId);

        const selectedVessel = allVessels.find(v => v.id === vesselId);
        if (!selectedVessel) {
            return { data: null, error: "Selected vessel not found.", message: "Error" };
        }
        
        const input: SuggestCrewAllocationInput = {
            route,
            vessel: selectedVessel.name,
            vesselRequirements: selectedVessel.requiredCerts || ['STCW', 'Basic Safety Training'], // Use stored certs or a default
        };

        const result = await suggestCrewAllocation(input, tenantId);
        return { data: result, error: null, message: "Suggestion received." };
    } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { data: null, error, message: "Failed to get suggestion." };
    }
}
