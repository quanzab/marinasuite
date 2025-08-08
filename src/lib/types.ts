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

export type Vessel = {
  id: string;
  name: string;
  imo: string;
  type: string;
  status: 'In Service' | 'In Maintenance' | 'Docked';
  nextMaintenance: string;
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

const scheduleMaintenanceFormSchema = z.object({
  nextMaintenance: z.date({
    required_error: "Next maintenance date is required.",
  }),
});

export type ScheduleMaintenanceFormValues = z.infer<typeof scheduleMaintenanceFormSchema>;
