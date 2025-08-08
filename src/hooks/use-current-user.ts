
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { CurrentUser } from '@/lib/types';

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // For the demo, we'll create a default user object based on the authenticated Firebase User.
        // This ensures the app can proceed even if the Firestore user record doesn't exist yet.
        // A real-world app would have more robust logic to sync Firestore records.
        
        let foundUser: CurrentUser | null = null;
        try {
            const orgsSnapshot = await getDocs(collection(db, 'orgs'));
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
                        name: userData.name || firebaseUser.displayName || 'Admin User',
                        role: userData.role || 'Admin',
                        tenant: userData.tenant,
                    };
                    break;
                }
            }
        } catch (error) {
            console.error("Error fetching user data from Firestore:", error);
        }
        
        if (foundUser) {
            setUser(foundUser);
        } else {
            // If no user is found in the DB, create a default admin user object to allow login.
            // This is a fallback for the demo environment.
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || 'Admin User',
              role: 'Admin',
              tenant: 'Global Maritime', // Default tenant
              id: firebaseUser.uid, // Use uid as id if not in DB
            });
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
