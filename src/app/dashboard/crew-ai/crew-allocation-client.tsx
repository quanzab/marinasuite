"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Bot, Check, ChevronsUpDown, Loader2, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCrewSuggestion } from "./actions";
import { mockCrew, mockVessels } from "@/lib/data";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting Suggestion...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Get Suggestion
        </>
      )}
    </Button>
  );
}

export default function CrewAllocationClient() {
  const initialState = { data: null, error: null, message: "" };
  const [state, formAction] = useFormState(getCrewSuggestion, initialState);

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Allocation Parameters</CardTitle>
          <CardDescription>
            Provide details about the route and select available crew.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="route">Route</Label>
              <Input id="route" name="route" placeholder="e.g., Singapore to Rotterdam" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vessel">Vessel</Label>
               <Select name="vessel" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vessel" />
                </SelectTrigger>
                <SelectContent>
                  {mockVessels.map(v => <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="grid gap-2">
              <Label>Available Crew</Label>
              <div className="grid gap-2 rounded-md border p-2 max-h-60 overflow-y-auto">
                 {mockCrew.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox id={member.id} name="crewMembers" value={member.name}/>
                        <Label htmlFor={member.id} className="w-full font-normal">
                            {member.name} <span className="text-muted-foreground">({member.rank})</span>
                        </Label>
                    </div>
                ))}
              </div>
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
            There was an error processing your request. Please check your inputs and try again.
          </AlertDescription>
        </Alert>
      )}

      {state.data ? (
        <div className="grid gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                        <CardTitle>Suggested Crew</CardTitle>
                        <CardDescription>The optimal crew based on your requirements.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {state.data.suggestedCrew.map(member => (
                            <li key={member} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-500" />
                                <span>{member}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Bot className="w-8 h-8 text-primary" />
                    <div>
                        <CardTitle>AI Reasoning</CardTitle>
                        <CardDescription>The logic behind the AI's suggestion.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {state.data.reasoning}
                    </p>
                </CardContent>
            </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center">
            <Bot className="w-16 h-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Waiting for Input</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Your AI-powered crew suggestions will appear here.
            </p>
        </div>
      )}
      </div>

    </div>
  );
}
