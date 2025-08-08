import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { CrewMember, Vessel } from './types';
import type { CrewFormValues } from '@/app/dashboard/crew/crew-form';
import type { VesselFormValues } from '@/app/dashboard/fleet/vessel-form';
import { format } from 'date-fns';


// For this MVP, we will assume a single tenant 'Global Maritime'
// In a multi-tenant app, you'd get the tenantId from the user's session
const TENANT_ID = 'Global Maritime'; 
const crewCollectionRef = collection(db, 'orgs', TENANT_ID, 'crew');
const vesselsCollectionRef = collection(db, 'orgs', TENANT_ID, 'vessels');

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
