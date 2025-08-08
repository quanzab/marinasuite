
"use server";

import { z } from "zod";
import { predictMaintenance, PredictMaintenanceOutput } from "@/ai/flows/predictive-maintenance-flow";
import { getVessels } from "@/lib/firestore";
import { differenceInYears } from "date-fns";

const formSchema = z.object({
    vesselId: z.string().min(1, "Vessel is required."),
    operatingHours: z.coerce.number().min(0, "Operating hours must be a positive number."),
});

type State = {
    data: PredictMaintenanceOutput | null;
    error: string | null;
    message: string;
};

export async function getMaintenancePrediction(
    prevState: State,
    formData: FormData
): Promise<State> {
    const validatedFields = formSchema.safeParse({
        vesselId: formData.get("vesselId"),
        operatingHours: formData.get("operatingHours"),
    });

    if (!validatedFields.success) {
        return {
            data: null,
            error: JSON.stringify(validatedFields.error.flatten().fieldErrors),
            message: "Validation failed.",
        };
    }

    const { vesselId, operatingHours } = validatedFields.data;

    try {
        const allVessels = await getVessels();
        const selectedVessel = allVessels.find(v => v.id === vesselId);

        if (!selectedVessel) {
            return { data: null, error: "Selected vessel not found.", message: "Error" };
        }
        
        // This is a simplification. In a real app, you'd likely have a "commissionedDate" or similar.
        // We'll estimate age based on the IMO number for this demo.
        const vesselAge = differenceInYears(new Date(), new Date(`${Number(selectedVessel.imo.substring(0,2)) + 1980}-01-01`));

        const result = await predictMaintenance({
            vesselName: selectedVessel.name,
            vesselType: selectedVessel.type,
            vesselAge: isNaN(vesselAge) ? 5 : vesselAge, // fallback age
            lastMaintenanceDate: selectedVessel.nextMaintenance, // Using nextMaintenance as a proxy for last service
            operatingHours,
        });

        return { data: result, error: null, message: "Prediction received." };
    } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { data: null, error, message: "Failed to get prediction." };
    }
}
