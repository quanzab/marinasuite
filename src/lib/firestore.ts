import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { CrewMember, Vessel, Certificate } from './types';
import type { CrewFormValues } from '@/app/dashboard/crew/crew-form';
import type { VesselFormValues } from '@/app/dashboard/fleet/vessel-form';
import type { CertificateFormValues } from '@/app/dashboard/certificates/certificate-form';
import { format } from 'date-fns';


// For this MVP, we will assume a single tenant 'Global Maritime'
// In a multi-tenant app, you'd get the tenantId from the user's session
const TENANT_ID = 'Global Maritime'; 
const crewCollectionRef = collection(db, 'orgs', TENANT_ID, 'crew');
const vesselsCollectionRef = collection(db, 'orgs', TENANT_ID, 'vessels');
const certificatesCollectionRef = collection(db, 'orgs', TENANT_ID, 'certificates');

// ====== CREW ======

// READ
export const getCrew = async (): Promise<CrewMember[]> => {
  const snapshot = await getDocs(crewCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CrewMember));
};

// CREATE
export const addCrewMember = async (crewData: CrewFormValues) => {
    const { name, rank, status } = crewData;
    await addDoc(crewCollectionRef, {
        name,
        rank,
        status,
        assignedVessel: null,
        certifications: [],
        medicalRecords: "No records yet."
    });
};

// UPDATE
export const updateCrewMember = async (id: string, crewData: Partial<CrewFormValues>) => {
  const crewDoc = doc(db, 'orgs', TENANT_ID, 'crew', id);
  await updateDoc(crewDoc, crewData);
};

// DELETE
export const deleteCrewMember = async (id: string) => {
  const crewDoc = doc(db, 'orgs', TENANT_ID, 'crew', id);
  await deleteDoc(crewDoc);
};


// ====== VESSELS ======

// READ
export const getVessels = async (): Promise<Vessel[]> => {
  const snapshot = await getDocs(vesselsCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vessel));
};

// CREATE
export const addVessel = async (vesselData: VesselFormValues) => {
    const { name, imo, type, status, nextMaintenance } = vesselData;
    await addDoc(vesselsCollectionRef, {
        name,
        imo,
        type,
        status,
        nextMaintenance: format(nextMaintenance, 'yyyy-MM-dd')
    });
};

// UPDATE
export const updateVessel = async (id: string, vesselData: Partial<VesselFormValues>) => {
  const vesselDoc = doc(db, 'orgs', TENANT_ID, 'vessels', id);
  
  // Format date if it exists in the update data
  if (vesselData.nextMaintenance) {
      const { nextMaintenance, ...rest } = vesselData;
      const formattedData = {
          ...rest,
          nextMaintenance: format(nextMaintenance, 'yyyy-MM-dd')
      };
      await updateDoc(vesselDoc, formattedData);
  } else {
      await updateDoc(vesselDoc, vesselData);
  }
};

// DELETE
export const deleteVessel = async (id: string) => {
  const vesselDoc = doc(db, 'orgs', TENANT_ID, 'vessels', id);
  await deleteDoc(vesselDoc);
};

// ====== CERTIFICATES ======

// READ
export const getCertificates = async (): Promise<Certificate[]> => {
    const snapshot = await getDocs(certificatesCollectionRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
};

// CREATE
export const addCertificate = async (certificateData: CertificateFormValues) => {
    const { name, issuedBy, issueDate, expiryDate } = certificateData;
    await addDoc(certificatesCollectionRef, {
        name,
        issuedBy,
        issueDate: format(issueDate, 'yyyy-MM-dd'),
        expiryDate: format(expiryDate, 'yyyy-MM-dd'),
    });
};

// UPDATE
export const updateCertificate = async (id: string, certificateData: Partial<CertificateFormValues>) => {
    const certDoc = doc(db, 'orgs', TENANT_ID, 'certificates', id);
    
    const dataToUpdate: Record<string, any> = { ...certificateData };

    if (certificateData.issueDate) {
        dataToUpdate.issueDate = format(certificateData.issueDate, 'yyyy-MM-dd');
    }
    if (certificateData.expiryDate) {
        dataToUpdate.expiryDate = format(certificateData.expiryDate, 'yyyy-MM-dd');
    }

    await updateDoc(certDoc, dataToUpdate);
};

// DELETE
export const deleteCertificate = async (id: string) => {
    const certDoc = doc(db, 'orgs', TENANT_ID, 'certificates', id);
    await deleteDoc(certDoc);
};
