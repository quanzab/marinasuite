
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { CurrentUser } from '@/lib/types';

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Look for user in all tenant collections. This is a simplification for the MVP.
          // In a real app, tenant would be known after login.
          const orgsSnapshot = await getDocs(collection(db, 'orgs'));
          let foundUser: CurrentUser | null = null;

          for (const orgDoc of orgsSnapshot.docs) {
            const usersCollectionRef = collection(db, 'orgs', orgDoc.id, 'users');
            const q = query(usersCollectionRef, where("email", "==", firebaseUser.email));
            const userSnapshot = await getDocs(q);

            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
              foundUser = {
                id: userSnapshot.docs[0].id,
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                name: userData.name,
                role: userData.role,
                tenant: userData.tenant,
              };
              break; 
            }
          }
           if (foundUser) {
             setUser(foundUser);
           } else {
             // Fallback for user not found in DB, maybe just created
             setUser({ uid: firebaseUser.uid, email: firebaseUser.email!, name: firebaseUser.displayName || 'New User', role: 'Viewer', tenant: 'Unknown' });
           }

        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email!, name: 'User', role: 'Viewer', tenant: 'Unknown' });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoading };
}
