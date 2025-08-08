

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

export type Route = {
    id: string;
    startPort: string;
    endPort: string;
    vessel: string;
    status: 'Open' | 'In Progress' | 'Completed';
}


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
})

export type UserFormValues = z.infer<typeof userFormSchema>;

export const renewCertificateFormSchema = z.object({
  expiryDate: z.date({ required_error: "New expiry date is required." }),
});
export type RenewCertificateFormValues = z.infer<typeof renewCertificateFormSchema>;
