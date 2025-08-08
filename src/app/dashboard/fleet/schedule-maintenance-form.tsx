
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Vessel, ScheduleMaintenanceFormValues } from "@/lib/types"
import { cn } from "@/lib/utils"


const formSchema = z.object({
  nextMaintenance: z.date({
    required_error: "Next maintenance date is required.",
  }),
})

interface ScheduleMaintenanceFormProps {
  vessel: Vessel | null;
  onSubmit: (data: ScheduleMaintenanceFormValues) => void;
  isSubmitting: boolean;
}

export function ScheduleMaintenanceForm({ vessel, onSubmit, isSubmitting }: ScheduleMaintenanceFormProps) {
  const form = useForm<ScheduleMaintenanceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nextMaintenance: vessel?.nextMaintenance ? new Date(vessel.nextMaintenance) : new Date(),
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nextMaintenance"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Next Maintenance Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Confirm Maintenance'}
        </Button>
      </form>
    </Form>
  )
}
