import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import type { CrewMember } from './types';
import type { CrewFormValues } from '@/app/dashboard/crew/crew-form';

// For this MVP, we will assume a single tenant 'Global Maritime'
// In a multi-tenant app, you'd get the tenantId from the user's session
const TENANT_ID = 'Global Maritime'; 
const crewCollectionRef = collection(db, 'orgs', TENANT_ID, 'crew');

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
