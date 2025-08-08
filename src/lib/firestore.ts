
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc, collectionGroup, query, where } from 'firebase/firestore';
import type { User, CrewMember, Vessel, Certificate } from './types';
import type { CrewFormValues } from '@/app/dashboard/crew/crew-form';
import type { VesselFormValues } from '@/app/dashboard/fleet/vessel-form';
import type { CertificateFormValues } from '@/app/dashboard/certificates/certificate-form';
import type { UserFormValues } from '@/app/dashboard/admin/user-form';
import { format } from 'date-fns';


// For this MVP, we will assume a single tenant 'Global Maritime'
// In a multi-tenant app, you'd get the tenantId from the user's session
const TENANT_ID = 'Global Maritime'; 
const crewCollectionRef = collection(db, 'orgs', TENANT_ID, 'crew');
const vesselsCollectionRef = collection(db, 'orgs', TENANT_ID, 'vessels');
const certificatesCollectionRef = collection(db, 'orgs', TENANT_ID, 'certificates');
const usersCollectionRef = collection(db, 'orgs', TENANT_ID, 'users');

// ====== CREW ======

// READ (all)
export const getCrew = async (): Promise<CrewMember[]> => {
  const snapshot = await getDocs(crewCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CrewMember));
};

// READ (single)
export const getCrewMemberById = async (id: string): Promise<CrewMember | null> => {
  const crewDocRef = doc(db, 'orgs', TENANT_ID, 'crew', id);
  const docSnap = await getDoc(crewDocRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as CrewMember;
  } else {
    return null;
  }
};


// CREATE
export const addCrewMember = async (crewData: CrewFormValues) => {
    const { name, rank, status } = crewData;
    await addDoc(crewCollectionRef, {
        name,
        rank,
        status,
        assignedVessel: null,
        certifications: ['Basic Safety Training', 'Advanced Fire Fighting'],
        medicalRecords: "Fit for duty. Last check-up: 2023-10-15."
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

// READ (all)
export const getVessels = async (): Promise<Vessel[]> => {
  const snapshot = await getDocs(vesselsCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vessel));
};

// READ (single)
export const getVesselById = async (id: string): Promise<Vessel | null> => {
  const vesselDocRef = doc(db, 'orgs', TENANT_ID, 'vessels', id);
  const docSnap = await getDoc(vesselDocRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Vessel;
  } else {
    return null;
  }
};


// CREATE
export const addVessel = async (vesselData: VesselFormValues) => {
    const { name, imo, type, status, nextMaintenance } = vesselData;
    await addDoc(vesselsCollectionRef, {
        name,
        imo,
        type,
        status,
        nextMaintenance: format(nextMaintenance, 'yyyy-MM-dd'),
        imageUrl: null
    });
};

// UPDATE
export const updateVessel = async (id: string, vesselData: Partial<VesselFormValues | { imageUrl: string }>) => {
  const vesselDoc = doc(db, 'orgs', TENANT_ID, 'vessels', id);
  
  const dataToUpdate: Record<string, any> = { ...vesselData };

  if (vesselData.nextMaintenance) {
      dataToUpdate.nextMaintenance = format(new Date(vesselData.nextMaintenance), 'yyyy-MM-dd');
  }
  
  await updateDoc(vesselDoc, dataToUpdate);
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
        dataToUpdate.issueDate = format(new Date(certificateData.issueDate), 'yyyy-MM-dd');
    }
    if (certificateData.expiryDate) {
        dataToUpdate.expiryDate = format(new Date(certificateData.expiryDate), 'yyyy-MM-dd');
    }

    await updateDoc(certDoc, dataToUpdate);
};

// DELETE
export const deleteCertificate = async (id: string) => {
    const certDoc = doc(db, 'orgs', TENANT_ID, 'certificates', id);
    await deleteDoc(certDoc);
};


// ====== USERS ======

// READ
export const getUsers = async (): Promise<User[]> => {
    // This function will now query all 'users' sub-collections across all 'orgs'
    const usersQuery = query(collectionGroup(db, 'users'));
    const snapshot = await getDocs(usersQuery);
    if (snapshot.empty) {
        // If there are truly no users, return an empty array.
        // The initial user data should be provisioned in a real setup.
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};


// CREATE
export const addUser = async (userData: UserFormValues) => {
    // This creates a user under a specific tenant.
    // In a real app, the tenantId would be dynamic.
    const specificUsersCollectionRef = collection(db, 'orgs', userData.tenant, 'users');
    await addDoc(specificUsersCollectionRef, userData);
};

// UPDATE
export const updateUser = async (id: string, userData: Partial<UserFormValues>) => {
  // To update a user, we need to know their tenant.
  // This is a simplification; a real app would need a more robust way to locate the user document.
  if (!userData.tenant) {
      throw new Error("Tenant must be provided to update a user.");
  }
  const userDoc = doc(db, 'orgs', userData.tenant, 'users', id);
  await updateDoc(userDoc, userData);
};

// DELETE
export const deleteUser = async (id: string, tenantId: string) => {
    if (!tenantId) {
        throw new Error("Tenant ID is required to delete a user.");
    }
    const userDoc = doc(db, 'orgs', tenantId, 'users', id);
    await deleteDoc(userDoc);
};
