
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CrewMember } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  rank: z.string().min(2, {
    message: "Rank is required.",
  }),
  status: z.enum(["Active", "On Leave", "Inactive"]),
})

export type CrewFormValues = z.infer<typeof formSchema>

interface CrewFormProps {
  crewMember: CrewMember | null;
  onSubmit: (data: CrewFormValues) => void;
  isSubmitting: boolean;
}

export function CrewForm({ crewMember, onSubmit, isSubmitting }: CrewFormProps) {
  const form = useForm<CrewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: crewMember?.name || "",
      rank: crewMember?.rank || "",
      status: crewMember?.status || "Active",
    },
  })

  const ranks = ["Captain", "Chief Engineer", "First Mate", "Second Mate", "Third Mate", "Chief Officer", "Second Engineer", "Third Engineer", "Deck Cadet", "Engine Cadet", "Able Seaman", "Oiler"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rank</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rank" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ranks.map(rank => <SelectItem key={rank} value={rank}>{rank}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (crewMember ? 'Save Changes' : 'Create Crew Member')}
        </Button>
      </form>
    </Form>
  )
}
