
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { useEffect, useState } from "react"
import { getCertificates } from "@/lib/firestore"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Vessel, Certificate } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useTenant } from "@/hooks/use-tenant"


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  imo: z.string().regex(/^[0-9]{7}$/, { message: "IMO must be 7 digits." }),
  type: z.string().min(2, { message: "Type is required." }),
  status: z.enum(["In Service", "In Maintenance", "Docked"]),
  nextMaintenance: z.date({
    required_error: "Next maintenance date is required.",
  }),
  requiredCerts: z.array(z.string()).optional(),
})

export type VesselFormValues = z.infer<typeof formSchema>

interface VesselFormProps {
  vessel: Vessel | null;
  onSubmit: (data: VesselFormValues) => void;
  isSubmitting: boolean;
}

export function VesselForm({ vessel, onSubmit, isSubmitting }: VesselFormProps) {
  const [allCerts, setAllCerts] = useState<Certificate[]>([]);
  const { tenantId } = useTenant();
  
  const form = useForm<VesselFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vessel?.name || "",
      imo: vessel?.imo || "",
      type: vessel?.type || "",
      status: vessel?.status || "In Service",
      nextMaintenance: vessel?.nextMaintenance ? new Date(vessel.nextMaintenance) : new Date(),
      requiredCerts: vessel?.requiredCerts || [],
    },
  })

  useEffect(() => {
    async function fetchCerts() {
      if (tenantId) {
        const certs = await getCertificates(tenantId);
        setAllCerts(certs);
      }
    }
    fetchCerts();
  }, [tenantId]);

  const vesselTypes = ["Container Ship", "Bulk Carrier", "Tanker", "LNG Carrier", "General Cargo", "Ro-Ro", "Passenger Ship"];

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
                <Input placeholder="Ocean Explorer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="imo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IMO Number</FormLabel>
              <FormControl>
                <Input placeholder="9123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vessel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vesselTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
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
                  <SelectItem value="In Service">In Service</SelectItem>
                  <SelectItem value="In Maintenance">In Maintenance</SelectItem>
                  <SelectItem value="Docked">Docked</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nextMaintenance"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Next Maintenance</FormLabel>
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
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requiredCerts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Certifications</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant="outline" role="combobox" className={cn("w-full justify-start font-normal h-auto flex-wrap py-2", !field.value?.length && "text-muted-foreground")}>
                                {field.value && field.value.length > 0 ? (
                                    <div className="flex gap-1 flex-wrap">
                                        {field.value.map((cert) => (
                                             <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                                                {cert}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        field.onChange(field.value?.filter(c => c !== cert));
                                                    }}
                                                    className="rounded-full hover:bg-muted-foreground/20"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <span>Select certifications</span>
                                )}
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <div className="p-2 max-h-60 overflow-y-auto">
                            {allCerts.map(cert => (
                                <div key={cert.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer" onClick={() => {
                                    const currentCerts = field.value || [];
                                    const newCerts = currentCerts.includes(cert.name)
                                        ? currentCerts.filter(c => c !== cert.name)
                                        : [...currentCerts, cert.name];
                                    field.onChange(newCerts);
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={field.value?.includes(cert.name)}
                                        readOnly
                                        className="h-4 w-4"
                                    />
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {cert.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
              <FormDescription>
                Select the certifications required for crew on this vessel.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (vessel ? 'Save Changes' : 'Create Vessel')}
        </Button>
      </form>
    </Form>
  )
}
