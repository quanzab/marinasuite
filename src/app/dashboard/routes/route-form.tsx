
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { routeFormSchema, type RouteFormValues, type Route, type Vessel } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface RouteFormProps {
  route: Route | null;
  vessels: Vessel[];
  onSubmit: (data: RouteFormValues) => void;
  isSubmitting: boolean;
}

export function RouteForm({ route, vessels, onSubmit, isSubmitting }: RouteFormProps) {
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      startPort: route?.startPort || "",
      endPort: route?.endPort || "",
      vessel: route?.vessel || "",
      status: route?.status || "Open",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="startPort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Port</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Port of Singapore" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endPort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Port</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Port of Rotterdam" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="vessel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Vessel</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vessel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vessels.filter(v => v.status === "In Service").map(v => <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>)}
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
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (route ? 'Save Changes' : 'Add Route')}
        </Button>
      </form>
    </Form>
  )
}
