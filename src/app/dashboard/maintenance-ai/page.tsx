
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Bot, Wrench, Ship, AlertTriangle, Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getMaintenancePrediction } from "./actions";
import { useState, useEffect } from "react";
import type { Vessel } from "@/lib/types";
import { getVessels } from "@/lib/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useTenant } from "@/hooks/use-tenant";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Get Prediction
        </>
      )}
    </Button>
  );
}

export default function MaintenanceAiPage() {
  const initialState = { data: null, error: null, message: "" };
  const [state, formAction] = useFormState(getMaintenancePrediction, initialState);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { tenantId } = useTenant();

  useEffect(() => {
    async function fetchData() {
        if (!tenantId) return;
      try {
        setIsLoading(true);
        const vesselData = await getVessels(tenantId);
        setVessels(vesselData);
      } catch (error) {
        console.error("Failed to fetch vessels for AI form", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [tenantId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Predictive Maintenance AI</h1>
      </div>
      <p className="text-muted-foreground">
        Use AI to forecast maintenance needs and prevent costly downtime.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Vessel Parameters</CardTitle>
            <CardDescription>
              Select a vessel and provide its recent operational data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                 <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="grid gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : (
            <form action={formAction} className="grid gap-6">
              <input type="hidden" name="tenantId" value={tenantId || ''} />
              <div className="grid gap-2">
                <Label htmlFor="vesselId">Vessel</Label>
                 <Select name="vesselId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    {vessels.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="operatingHours">Operating Hours Since Last Service</Label>
                <Input id="operatingHours" name="operatingHours" type="number" placeholder="e.g., 2500" required />
              </div>
              <SubmitButton />
            </form>
            )}
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
        {state.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error processing your request: {state.error}
            </AlertDescription>
          </Alert>
        )}

        {state.data ? (
          <div className="grid gap-6">
              <Card>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <Wrench className="w-8 h-8 text-primary" />
                      <div>
                          <CardTitle>Overall Assessment</CardTitle>
                          <CardDescription>AI-generated summary of the vessel's condition.</CardDescription>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                          {state.data.overallAssessment}
                      </p>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader>
                      <CardTitle>Predicted Maintenance Tasks</CardTitle>
                      <CardDescription>Specific actions recommended by the AI.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {state.data.predictedIssues.map((issue, index) => (
                         <div key={index} className="flex items-start gap-4">
                            <AlertTriangle className={`w-5 h-5 mt-1 ${issue.urgency === 'High' ? 'text-destructive' : issue.urgency === 'Medium' ? 'text-yellow-500' : 'text-primary'}`} />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="font-semibold">{issue.task}</p>
                                    <Badge variant={issue.urgency === 'High' ? 'destructive' : 'outline'}>{issue.urgency}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{issue.reason}</p>
                            </div>
                         </div>
                     ))}
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <Calendar className="w-8 h-8 text-primary" />
                      <div>
                          <CardTitle>Next Recommended Service</CardTitle>
                          <CardDescription>{state.data.nextServiceDate}</CardDescription>
                      </div>
                  </CardHeader>
              </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center">
              <Bot className="w-16 h-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Awaiting Vessel Data</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                  Your AI-powered maintenance predictions will appear here.
              </p>
          </div>
        )}
        </div>

      </div>
    </div>
  );
}
