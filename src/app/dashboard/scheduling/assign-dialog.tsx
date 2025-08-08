
'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Vessel, CrewMember } from "@/lib/types";
import { assignCrewFormSchema, type AssignCrewFormValues } from "@/lib/types";


interface AssignDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isSubmitting: boolean;
    vessels: Vessel[];
    crewMember: CrewMember | null;
    onSubmit: (data: AssignCrewFormValues) => void;
}

export function AssignDialog({ isOpen, onOpenChange, isSubmitting, vessels, crewMember, onSubmit }: AssignDialogProps) {
    const form = useForm<AssignCrewFormValues>({
        resolver: zodResolver(assignCrewFormSchema),
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Crew Member</DialogTitle>
                    <DialogDescription>
                        Assign "{crewMember?.name}" to an available vessel.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                         <FormField
                            control={form.control}
                            name="vesselName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vessel</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a vessel" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {vessels.filter(v => v.status === 'In Service').map(v => (
                                            <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

