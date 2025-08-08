import type { CrewMember, Vessel, Certificate, User } from './types';

export const mockCrew: CrewMember[] = [
  { id: 'C001', name: 'John Doe', rank: 'Captain', status: 'Active', assignedVessel: 'V001', certifications: ['Master Mariner', 'GMDSS'], medicalRecords: 'Fit for duty' },
  { id: 'C002', name: 'Jane Smith', rank: 'Chief Engineer', status: 'Active', assignedVessel: 'V001', certifications: ['Chief Engineer Unlimited', 'STCW'], medicalRecords: 'Fit for duty' },
  { id: 'C003', name: 'Peter Jones', rank: 'First Mate', status: 'On Leave', certifications: ['OOW', 'ECDIS'], medicalRecords: 'Fit for duty' },
  { id: 'C004', name: 'Mary Johnson', rank: 'Second Engineer', status: 'Active', assignedVessel: 'V002', certifications: ['Second Engineer Unlimited'], medicalRecords: 'Requires dental checkup' },
  { id: 'C005', name: 'David Williams', rank: 'Able Seaman', status: 'Inactive', certifications: ['AB'], medicalRecords: 'N/A' },
  { id: 'C006', name: 'Susan Brown', rank: 'Deck Cadet', status: 'Active', assignedVessel: 'V003', certifications: ['Basic Safety Training'], medicalRecords: 'Fit for duty' },
];

export const mockVessels: Vessel[] = [
  { id: 'V001', name: 'Ocean Explorer', imo: '9123456', type: 'Container Ship', status: 'In Service', nextMaintenance: '2024-12-15' },
  { id: 'V002', name: 'Sea Serpent', imo: '9234567', type: 'Bulk Carrier', status: 'In Maintenance', nextMaintenance: '2024-08-01' },
  { id: 'V003', name: 'Coastal Voyager', imo: '9345678', type: 'Tanker', status: 'Docked', nextMaintenance: '2025-02-20' },
  { id: 'V004', name: 'Arctic Pioneer', imo: '9456789', type: 'LNG Carrier', status: 'In Service', nextMaintenance: '2024-11-10' },
];

export const mockCertificates: Certificate[] = [
  { id: 'CERT01', name: 'Master Mariner', issuedBy: 'Maritime Authority', issueDate: '2020-05-20', expiryDate: '2025-05-19' },
  { id: 'CERT02', name: 'STCW Basic Safety', issuedBy: 'Training Center', issueDate: '2022-08-10', expiryDate: '2027-08-09' },
  { id: 'CERT03', name: 'GMDSS GOC', issuedBy: 'Communications Board', issueDate: '2019-11-30', expiryDate: '2024-11-29' },
  { id: 'CERT04', name: 'Medical First Aid', issuedBy: 'Red Cross', issueDate: '2023-01-15', expiryDate: '2025-01-14' },
  { id: 'CERT05', name: 'Ship Security Officer', issuedBy: 'Homeland Security', issueDate: '2021-07-22', expiryDate: '2024-07-21' },
  { id: 'CERT06', name: 'ECDIS Generic', issuedBy: 'Tech Solutions', issueDate: '2018-06-01', expiryDate: '2023-05-31' },
];

export const mockUsers: User[] = [
  { id: 'U001', name: 'Admin User', email: 'admin@marinasuite.com', role: 'Admin', tenant: 'Global Maritime' },
  { id: 'U002', name: 'Manager User', email: 'manager@marinasuite.com', role: 'Manager', tenant: 'Global Maritime' },
  { id: 'U003', name: 'Viewer User', email: 'viewer@marinasuite.com', role: 'Viewer', tenant: 'Coastal Shipping' },
  { id: 'U004', name: 'Alice Admin', email: 'alice@marinasuite.com', role: 'Admin', tenant: 'Coastal Shipping' },
];
