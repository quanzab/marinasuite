
"use server";

import { z } from "zod";
import { generateShanty, GenerateShantyOutput } from "@/ai/flows/generate-shanty-flow";
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
        };
    }

    const { vesselId, tenantId } = validatedFields.data;

    try {
        const allVessels = await getVessels(tenantId);
        const selectedVessel = allVessels.find(v => v.id === vesselId);

        if (!selectedVessel) {
            return { data: null, error: "Selected vessel not found.", message: "Error" };
        }

        const result = await generateShanty({
            vesselName: selectedVessel.name,
        });

        return { data: result, error: null, message: "Shanty generated." };
    } catch (e) {
        console.error(e);
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { data: null, error, message: "Failed to generate shanty." };
    }
}
