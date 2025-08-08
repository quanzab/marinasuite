
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Bot, FileText, Activity, ShieldAlert, ListChecks, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getSafetyReportAnalysis } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing Report...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Analyze Report
        </>
      )}
    </Button>
  );
}

export default function SafetyAiPage() {
  const initialState = { data: null, error: null, message: "" };
  const [state, formAction] = useFormState(getSafetyReportAnalysis, initialState);

  const riskLevelColors = {
    'Low': 'bg-green-500',
    'Medium': 'bg-yellow-500',
    'High': 'bg-orange-500',
    'Critical': 'bg-red-500',
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Safety Report Analysis AI</h1>
      </div>
      <p className="text-muted-foreground">
        Paste a safety or incident report below to receive an AI-powered analysis and recommendations.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Incident Report</CardTitle>
            <CardDescription>
              Provide the full text of the report to be analyzed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="reportText">Report Details</Label>
                <Textarea
                  id="reportText"
                  name="reportText"
                  placeholder="e.g., During cargo operations, a container was dropped..."
                  required
                  rows={15}
                />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
        {state.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error processing your request: {JSON.parse(state.error).reportText}
            </AlertDescription>
          </Alert>
        )}

        {state.data ? (
          <div className="grid gap-6">
              <Card>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                          <CardTitle>Analysis Summary</CardTitle>
                          <CardDescription>A concise overview of the incident.</CardDescription>
                      </div>
                      <Badge
                        className={`ml-auto text-white ${riskLevelColors[state.data.riskLevel]}`}
                      >
                        {state.data.riskLevel} Risk
                      </Badge>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                          {state.data.summary}
                      </p>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <ShieldAlert className="w-8 h-8 text-primary" />
                      <div>
                          <CardTitle>Key Findings</CardTitle>
                          <CardDescription>The primary causes and contributing factors.</CardDescription>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     {state.data.keyFindings.map((finding, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <Activity className="w-4 h-4 mt-1 flex-shrink-0 text-yellow-500" />
                            <p className="text-sm text-muted-foreground">{finding}</p>
                        </div>
                     ))}
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <ListChecks className="w-8 h-8 text-primary" />
                      <div>
                          <CardTitle>Suggested Actions</CardTitle>
                          <CardDescription>Recommended steps to prevent recurrence.</CardDescription>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                      {state.data.suggestedActions.map((action, index) => (
                          <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0 text-green-500" />
                              <p className="text-sm text-muted-foreground">{action}</p>
                          </div>
                      ))}
                  </CardContent>
              </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center">
              <Bot className="w-16 h-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Awaiting Safety Report</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                  Your AI-powered safety analysis will appear here.
              </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
