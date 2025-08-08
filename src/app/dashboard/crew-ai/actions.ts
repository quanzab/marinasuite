"use server";

import { z } from "zod";
import { suggestCrewAllocation, SuggestCrewAllocationInput, SuggestCrewAllocationOutput } from "@/ai/flows/suggest-crew-allocation";

const formSchema = z.object({
    route: z.string().min(1, "Route is required."),
    vessel: z.string().min(1, "Vessel is required."),
    crewMembers: z.array(z.string()).min(1, "At least one crew member must be selected."),
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
        vessel: formData.get("vessel"),
        crewMembers: formData.getAll("crewMembers"),
    });

    if (!validatedFields.success) {
        return {
            data: null,
            error: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed.",
        };
    }

    const { route, vessel, crewMembers } = validatedFields.data;

    // This is mock data, in a real app this would come from a database.
    const crewCertifications = {
        'John Doe': ['Master Mariner', 'GMDSS'],
        'Jane Smith': ['Chief Engineer Unlimited', 'STCW'],
        'Peter Jones': ['OOW', 'ECDIS'],
        'Mary Johnson': ['Second Engineer Unlimited'],
        'David Williams': ['AB'],
        'Susan Brown': ['Basic Safety Training'],
    };

    const vesselRequirements = {
        'Ocean Explorer': ['Master Mariner', 'Chief Engineer Unlimited', 'STCW'],
        'Sea Serpent': ['Master Mariner', 'STCW', 'AB'],
        'Coastal Voyager': ['OOW', 'GMDSS'],
        'Arctic Pioneer': ['LNG Certificate', 'Master Mariner'],
    };

    const input: SuggestCrewAllocationInput = {
        route,
        vessel,
        availableCrew: crewMembers,
        crewCertifications: Object.fromEntries(
          Object.entries(crewCertifications).filter(([key]) => crewMembers.includes(key))
        ),
        vesselRequirements: vesselRequirements[vessel as keyof typeof vesselRequirements] || [],
    };

    try {
        const result = await suggestCrewAllocation(input);
        return { data: result, error: null, message: "Suggestion received." };
    } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { data: null, error, message: "Failed to get suggestion." };
    }
}
