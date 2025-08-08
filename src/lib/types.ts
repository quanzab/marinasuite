export type CrewMember = {
  id: string;
  name: string;
  rank: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  assignedVessel?: string;
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
