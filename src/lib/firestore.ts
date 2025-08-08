

import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc, collectionGroup, query, where, arrayUnion, onSnapshot } from 'firebase/firestore';
import type { User, CrewMember, Vessel, Certificate, MaintenanceRecord, Route, InventoryItem } from './types';
import type { CrewFormValues } from '@/app/dashboard/crew/crew-form';
import type { VesselFormValues } from '@/app/dashboard/fleet/vessel-form';
import type { CertificateFormValues } from '@/app/dashboard/certificates/certificate-form';
import type { UserFormValues, UpdateUserFormValues } from '@/app/dashboard/settings/page';
import { format } from 'date-fns';
import type { InventoryFormValues } from '@/app/dashboard/inventory/inventory-form';

// ====== REAL-TIME SUBSCRIPTIONS ======

// SUBSCRIBE to Crew
export const subscribeToCrew = async (
  tenantId: string, 
  callback: (crew: CrewMember[]) => void, 
  onError: (error: Error) => void
) => {
  if (!tenantId) {
    onError(new Error("Tenant ID is required."));
    return () => {}; // Return an empty unsubscribe function
  }
  const crewCollectionRef = collection(db, 'orgs', tenantId, 'crew');
  const unsubscribe = onSnapshot(crewCollectionRef, (snapshot) => {
    const crewData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CrewMember));
    callback(crewData);
  }, (error) => {
    console.error("Error subscribing to crew:", error);
    onError(error);
  });
  return unsubscribe;
};

// SUBSCRIBE to Vessels
export const subscribeToVessels = async (
  tenantId: string, 
  callback: (vessels: Vessel[]) => void,
  onError?: (error: Error) => void
) => {
  if (!tenantId) {
    onError?.(new Error("Tenant ID is required."));
    return () => {};
  }
  const vesselsCollectionRef = collection(db, 'orgs', tenantId, 'vessels');
  const unsubscribe = onSnapshot(vesselsCollectionRef, (snapshot) => {
    const vesselData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vessel));
    callback(vesselData);
  }, (error) => {
    console.error("Error subscribing to vessels:", error);
    onError?.(error);
  });
  return unsubscribe;
};


// SUBSCRIBE to Certificates
export const subscribeToCertificates = async (
  tenantId: string,
  callback: (certificates: Certificate[]) => void,
  onError: (error: Error) => void
) => {
  if (!tenantId) {
    onError(new Error("Tenant ID is required."));
    return () => {};
  }
  const certificatesCollectionRef = collection(db, 'orgs', tenantId, 'certificates');
  const unsubscribe = onSnapshot(certificatesCollectionRef, (snapshot) => {
    const certificateData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
    callback(certificateData);
  }, (error) => {
    console.error("Error subscribing to certificates:", error);
    onError(error);
  });
  return unsubscribe;
};

// SUBSCRIBE to Inventory
export const subscribeToInventory = async (
  tenantId: string,
  callback: (inventory: InventoryItem[]) => void,
  onError: (error: Error) => void
) => {
  if (!tenantId) {
    onError(new Error("Tenant ID is required."));
    return () => {};
  }
  const inventoryCollectionRef = collection(db, 'orgs', tenantId, 'inventory');
  const unsubscribe = onSnapshot(inventoryCollectionRef, (snapshot) => {
    const inventoryData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
    callback(inventoryData);
  }, (error) => {
    console.error("Error subscribing to inventory:", error);
    onError(error);
  });
  return unsubscribe;
};


// ====== ONE-TIME FETCHES ======

// READ (all)
export const getCrew = async (tenantId: string): Promise<CrewMember[]> => {
  if (!tenantId) return [];
  const crewCollectionRef = collection(db, 'orgs', tenantId, 'crew');
  const snapshot = await getDocs(crewCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CrewMember));
};

// READ (single)
export const getCrewMemberById = async (tenantId: string, id: string): Promise<CrewMember | null> => {
  if (!tenantId) return null;
  const crewDocRef = doc(db, 'orgs', tenantId, 'crew', id);
  const docSnap = await getDoc(crewDocRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as CrewMember;
  } else {
    return null;
  }
};


// CREATE
export const addCrewMember = async (tenantId: string, crewData: CrewFormValues) => {
    if (!tenantId) throw new Error("Tenant ID is required.");
    const crewCollectionRef = collection(db, 'orgs', tenantId, 'crew');
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
export const updateCrewMember = async (tenantId: string, id: string, crewData: Partial<CrewFormValues & { assignedVessel: string | null }>) => {
  if (!tenantId) throw new Error("Tenant ID is required.");
  const crewDoc = doc(db, 'orgs', tenantId, 'crew', id);
  await updateDoc(crewDoc, crewData);
};

// DELETE
export const deleteCrewMember = async (tenantId: string, id: string) => {
  if (!tenantId) throw new Error("Tenant ID is required.");
  const crewDoc = doc(db, 'orgs', tenantId, 'crew', id);
  await deleteDoc(crewDoc);
};


// ====== VESSELS ======

// READ (all)
export const getVessels = async (tenantId: string): Promise<Vessel[]> => {
  if (!tenantId) return [];
  const vesselsCollectionRef = collection(db, 'orgs', tenantId, 'vessels');
  const snapshot = await getDocs(vesselsCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vessel));
};

// READ (single)
export const getVesselById = async (tenantId: string, id: string): Promise<Vessel | null> => {
  if (!tenantId) return null;
  const vesselDocRef = doc(db, 'orgs', tenantId, 'vessels', id);
  const docSnap = await getDoc(vesselDocRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Vessel;
  } else {
    return null;
  }
};


// CREATE
export const addVessel = async (tenantId: string, vesselData: VesselFormValues) => {
    if (!tenantId) throw new Error("Tenant ID is required.");
    const vesselsCollectionRef = collection(db, 'orgs', tenantId, 'vessels');
    const { name, imo, type, status, nextMaintenance } = vesselData;
    await addDoc(vesselsCollectionRef, {
        name,
        imo,
        type,
        status,
        nextMaintenance: format(nextMaintenance, 'yyyy-MM-dd'),
        imageUrl: null,
        videoUrl: null,
        maintenanceHistory: [],
    });
};

// UPDATE
export const updateVessel = async (tenantId: string, id: string, vesselData: Partial<VesselFormValues | { imageUrl: string | null, videoUrl: string | null }>) => {
  if (!tenantId) throw new Error("Tenant ID is required.");
  const vesselDoc = doc(db, 'orgs', tenantId, 'vessels', id);
  
  const dataToUpdate: Record<string, any> = { ...vesselData };

  if (vesselData.nextMaintenance) {
      dataToUpdate.nextMaintenance = format(new Date(vesselData.nextMaintenance), 'yyyy-MM-dd');
  }
  
  await updateDoc(vesselDoc, dataToUpdate);
};

// ADD MAINTENANCE RECORD
export const addMaintenanceRecord = async (tenantId: string, id: string, record: MaintenanceRecord) => {
    if (!tenantId) throw new Error("Tenant ID is required.");
    const vesselDoc = doc(db, 'orgs', tenantId, 'vessels', id);
    await updateDoc(vesselDoc, {
        maintenanceHistory: arrayUnion(record)
    });
};


// DELETE
export const deleteVessel = async (tenantId: string, id: string) => {
  if (!tenantId) throw new Error("Tenant ID is required.");
  const vesselDoc = doc(db, 'orgs', tenantId, 'vessels', id);
  await deleteDoc(vesselDoc);
};

// ====== CERTIFICATES ======

// READ
export const getCertificates = async (tenantId: string): Promise<Certificate[]> => {
    if (!tenantId) return [];
    const certificatesCollectionRef = collection(db, 'orgs', tenantId, 'certificates');
    const snapshot = await getDocs(certificatesCollectionRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
};

// CREATE
export const addCertificate = async (tenantId: string, certificateData: CertificateFormValues) => {
    if (!tenantId) throw new Error("Tenant ID is required.");
    const certificatesCollectionRef = collection(db, 'orgs', tenantId, 'certificates');
    const { name, issuedBy, issueDate, expiryDate } = certificateData;
    await addDoc(certificatesCollectionRef, {
        name,
        issuedBy,
        issueDate: format(issueDate, 'yyyy-MM-dd'),
        expiryDate: format(expiryDate, 'yyyy-MM-dd'),
    });
};

// UPDATE
export const updateCertificate = async (tenantId: string, id: string, certificateData: Partial<CertificateFormValues>) => {
    if (!tenantId) throw new Error("Tenant ID is required.");
    const certDoc = doc(db, 'orgs', tenantId, 'certificates', id);
    
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
export const deleteCertificate = async (tenantId: string, id: string) => {
    if (!tenantId) throw new Error("Tenant ID is required.");
    const certDoc = doc(db, 'orgs', tenantId, 'certificates', id);
    await deleteDoc(certDoc);
};


// ====== USERS ======

// READ
export const getUsers = async (): Promise<User[]> => {
    const usersQuery = query(collectionGroup(db, 'users'));
    const snapshot = await getDocs(usersQuery);
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};


// CREATE
export const addUser = async (userData: UserFormValues) => {
    const specificUsersCollectionRef = collection(db, 'orgs', userData.tenant, 'users');
    await addDoc(specificUsersCollectionRef, userData);
};

// UPDATE
export const updateUser = async (id: string, userData: Partial<UserFormValues>) => {
  if (!userData.tenant) {
      throw new Error("Tenant must be provided to update a user.");
  }
  const userDoc = doc(db, 'orgs', userData.tenant, 'users', id);
  await updateDoc(userDoc, userData);
};

// UPDATE (Profile)
export const updateUserProfile = async (tenantId: string, userId: string, data: UpdateUserFormValues) => {
    if (!tenantId) throw new Error("Tenant ID is required.");
    const userDoc = doc(db, 'orgs', tenantId, 'users', userId);
    await updateDoc(userDoc, data);
};


// DELETE
export const deleteUser = async (id: string, tenantId: string) => {
    if (!tenantId) {
        throw new Error("Tenant ID is required to delete a user.");
    }
    const userDoc = doc(db, 'orgs', tenantId, 'users', id);
    await deleteDoc(userDoc);
};

// ====== ROUTES ======

// READ (all)
export const getRoutes = async (tenantId: string): Promise<Route[]> => {
  if (!tenantId) return [];
  // For this demo, we will return an empty array as a clean starting state. 
  // In a real app, this would query a 'routes' collection similar to the others.
  return Promise.resolve([]);
};

// ====== INVENTORY ======

// CREATE
export const addInventoryItem = async (tenantId: string, itemData: InventoryFormValues) => {
    if (!tenantId) throw new Error("Tenant ID is required.");
    const inventoryCollectionRef = collection(db, 'orgs', tenantId, 'inventory');
    await addDoc(inventoryCollectionRef, itemData);
};

// UPDATE
export const updateInventoryItem = async (tenantId: string, id: string, itemData: Partial<InventoryFormValues>) => {
    if (!tenantId) throw new Error("Tenant ID is required.");
    const itemDoc = doc(db, 'orgs', tenantId, 'inventory', id);
    await updateDoc(itemDoc, itemData);
};

// DELETE
export const deleteInventoryItem = async (tenantId: string, id: string) => {
    if (!tenantId) throw new Error("Tenant ID is required.");
    const itemDoc = doc(db, 'orgs', tenantId, 'inventory', id);
    await deleteDoc(itemDoc);
};
