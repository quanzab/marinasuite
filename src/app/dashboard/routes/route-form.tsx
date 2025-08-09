

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format, formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { routeFormSchema, type RouteFormValues, type Route, type Vessel } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Clock, Download } from "lucide-react"
import { downloadCSV } from "../reporting/page"


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
      newEvent: "",
    },
  })

  // Sort events from newest to oldest for display
  const sortedEvents = route?.events ? [...route.events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];
  const availableVessels = vessels.filter(v => v.status === "In Service");

  const handleExportEvents = () => {
    if (!sortedEvents || sortedEvents.length === 0) return;

    const dataToExport = sortedEvents.map(event => ({
        timestamp: format(new Date(event.timestamp), "yyyy-MM-dd HH:mm:ss"),
        description: event.description,
    }));
    
    downloadCSV(dataToExport, `voyage_events_${route?.vessel || 'route'}.csv`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
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
                    {availableVessels.map(v => <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <FormDescription>
                    Only vessels currently "In Service" are shown.
                </FormDescription>
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
        </div>
        
        {route && (
            <>
                <Separator />
                 <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="newEvent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Add Voyage Event</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="e.g., 'Departed from port' or 'Reached waypoint Alpha'" {...field} />
                                </FormControl>
                                <FormDescription>Log a new event for this voyage. This will be timestamped.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <FormLabel>Recent Events</FormLabel>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={handleExportEvents}
                                disabled={!sortedEvents || sortedEvents.length === 0}
                            >
                                <Download className="h-3 w-3 mr-2" />
                                Export Events
                            </Button>
                        </div>
                        <div className="space-y-3 max-h-48 overflow-y-auto rounded-md border p-3">
                            {sortedEvents.length > 0 ? (
                                sortedEvents.map((event, index) => (
                                    <div key={index} className="flex items-start gap-3 text-sm">
                                        <Clock className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                                        <div className="flex-1">
                                            <p>{event.description}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No events logged yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )}
       
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : (route ? 'Save Changes' : 'Add Route')}
        </Button>
      </form>
    </Form>
  )
}
