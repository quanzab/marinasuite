
"use server";

import { z } from "zod";
import { suggestRoute, SuggestRouteOutput } from "@/ai/flows/suggest-route-flow";

const formSchema = z.object({
    startPort: z.string().min(2, "Start port is required."),
    endPort: z.string().min(2, "End port is required."),
    vesselType: z.string().min(2, "Vessel type is required."),
});

type State = {
    data: SuggestRouteOutput | null;
    error: string | null;
    message: string;
};

export async function getRouteSuggestion(
    prevState: State,
    formData: FormData
): Promise<State> {
    const validatedFields = formSchema.safeParse({
        startPort: formData.get("startPort"),
        endPort: formData.get("endPort"),
        vesselType: formData.get("vesselType"),
    });

    if (!validatedFields.success) {
        return {
            data: null,
            error: JSON.stringify(validatedFields.error.flatten().fieldErrors),
            message: "Validation failed.",
        };
    }

    try {
        const result = await suggestRoute(validatedFields.data);
        return { data: result, error: null, message: "Suggestion received." };
    } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { data: null, error, message: "Failed to get suggestion." };
    }
}
