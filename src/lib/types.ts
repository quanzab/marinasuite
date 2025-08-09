

import { z } from "zod";

export type CrewMember = {
  id: string;
  name: string;
  rank: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  assignedVessel?: string | null;
  certifications?: string[];
  medicalRecords?: string;
};

export type MaintenanceRecord = {
  date: string;
  description: string;
};

export type Vessel = {
  id: string;
  name: string;
  imo: string;
  type: string;
  status: 'In Service' | 'In Maintenance' | 'Docked';
  nextMaintenance: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  maintenanceHistory?: MaintenanceRecord[];
  requiredCerts?: string[];
};

export type Certificate = {
  id: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
};

export type CertificateWithStatus = Certificate & {
  daysUntilExpiry: number;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
};


export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Viewer';
  tenant: string;
};

export type CurrentUser = User & {
    uid: string;
}

export type RouteEvent = {
    timestamp: string;
    description: string;
}

export type Route = {
    id: string;
    startPort: string;
    endPort: string;
    vessel: string;
    status: 'Open' | 'In Progress' | 'Completed';
    events?: RouteEvent[];
}

export type InventoryItem = {
    id: string;
    name: string;
    category: string;
    quantity: number;
    location: string; // Could be a vessel name or a warehouse
};

export type Notification = {
    id: string;
    title: string;
    description: string;
    type: 'Certificate' | 'Maintenance' | 'System';
    relatedId: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    isRead: boolean;
};


export const scheduleMaintenanceFormSchema = z.object({
  nextMaintenance: z.date({
    required_error: "Next maintenance date is required.",
  }),
});

export type ScheduleMaintenanceFormValues = z.infer<typeof scheduleMaintenanceFormSchema>;

export const maintenanceLogFormSchema = z.object({
    date: z.date({ required_error: "Maintenance date is required." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

export type MaintenanceLogFormValues = z.infer<typeof maintenanceLogFormSchema>;


export const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(["Admin", "Manager", "Viewer"]),
  tenant: z.string().min(2, { message: "Tenant is required." }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const renewCertificateFormSchema = z.object({
  expiryDate: z.date({ required_error: "New expiry date is required." }),
});
export type RenewCertificateFormValues = z.infer<typeof renewCertificateFormSchema>;

export const assignCrewFormSchema = z.object({
  vesselName: z.string().min(1, { message: "Please select a vessel." }),
});
export type AssignCrewFormValues = z.infer<typeof assignCrewFormSchema>;

export const inventoryFormSchema = z.object({
    name: z.string().min(2, { message: "Item name must be at least 2 characters." }),
    category: z.string().min(2, { message: "Category is required." }),
    quantity: z.coerce.number().min(0, { message: "Quantity cannot be negative." }),
    location: z.string().min(2, { message: "Location is required." }),
});
export type InventoryFormValues = z.infer<typeof inventoryFormSchema>;


export const routeFormSchema = z.object({
    startPort: z.string().min(2, { message: "Start port is required." }),
    endPort: z.string().min(2, { message: "End port is required." }),
    vessel: z.string().min(1, { message: "Please select a vessel." }),
    status: z.enum(["Open", "In Progress", "Completed"]),
    newEvent: z.string().optional(),
});
export type RouteFormValues = z.infer<typeof routeFormSchema>;
