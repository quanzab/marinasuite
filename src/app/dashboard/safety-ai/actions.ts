
"use server";

import { z } from "zod";
import { analyzeSafetyReport, AnalyzeSafetyReportOutput } from "@/ai/flows/analyze-safety-report-flow";

const formSchema = z.object({
    reportText: z.string().min(50, "Safety report must be at least 50 characters long."),
});

type State = {
    data: AnalyzeSafetyReportOutput | null;
    error: string | null;
    message: string;
};

export async function getSafetyReportAnalysis(
    prevState: State,
    formData: FormData
): Promise<State> {
    const validatedFields = formSchema.safeParse({
        reportText: formData.get("reportText"),
    });

    if (!validatedFields.success) {
        return {
            data: null,
            error: JSON.stringify(validatedFields.error.flatten().fieldErrors),
            message: "Validation failed.",
        };
    }

    try {
        const result = await analyzeSafetyReport(validatedFields.data);
        return { data: result, error: null, message: "Analysis complete." };
    } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { data: null, error, message: "Failed to get analysis." };
    }
}
