
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Bot, Anchor, Sailboat, Map, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getRouteSuggestion } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Optimizing...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Get Route Suggestion
        </>
      )}
    </Button>
  );
}

export default function RouteAiPage() {
  const initialState = { data: null, error: null, message: "" };
  const [state, formAction] = useFormState(getRouteSuggestion, initialState);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Route Optimizer AI</h1>
      </div>
      <p className="text-muted-foreground">
        Leverage AI to find the most efficient and safest shipping routes between any two ports.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Route Parameters</CardTitle>
            <CardDescription>
              Enter the journey details to get an optimized route.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="startPort">Start Port</Label>
                <Input id="startPort" name="startPort" placeholder="e.g., Port of Shanghai" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endPort">End Port</Label>
                <Input id="endPort" name="endPort" placeholder="e.g., Port of Rotterdam" required />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="vesselType">Vessel Type</Label>
                 <Select name="vesselType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vessel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Container Ship">Container Ship</SelectItem>
                    <SelectItem value="Bulk Carrier">Bulk Carrier</SelectItem>
                    <SelectItem value="Tanker">Tanker</SelectItem>
                    <SelectItem value="LNG Carrier">LNG Carrier</SelectItem>
                    <SelectItem value="General Cargo">General Cargo</SelectItem>
                  </SelectContent>
                </Select>
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
              There was an error processing your request: {state.error}
            </AlertDescription>
          </Alert>
        )}

        {state.data ? (
          <div className="grid gap-6">
              <Card>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <Map className="w-8 h-8 text-primary" />
                      <div>
                          <CardTitle>Suggested Route</CardTitle>
                          <CardDescription>{state.data.suggestedRoute}</CardDescription>
                      </div>
                      <div className="ml-auto flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4"/>
                        <span>{state.data.estimatedDuration}</span>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                          {state.data.reasoning}
                      </p>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                       <AlertTriangle className="w-8 h-8 text-destructive" />
                      <div>
                          <CardTitle>Potential Risks</CardTitle>
                          <CardDescription>Key challenges to be aware of on this route.</CardDescription>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                          {state.data.potentialRisks}
                      </p>
                  </CardContent>
              </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center">
              <Bot className="w-16 h-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">Waiting for Route Input</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                  Your AI-powered route suggestions will appear here.
              </p>
          </div>
        )}
        </div>

      </div>
    </div>
  );
}
