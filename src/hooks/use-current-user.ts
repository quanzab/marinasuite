
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, getDocs, collectionGroup } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { CurrentUser } from '@/lib/types';

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        
        // When auth state changes, force a token refresh to get latest custom claims.
        const idTokenResult = await firebaseUser.getIdTokenResult(true);
        const claims = idTokenResult.claims;
        const userRole = (claims.role as 'Admin' | 'Manager' | 'Viewer') || 'Admin'; // Default to 'Admin' for first user

        let foundUser: Omit<CurrentUser, 'role' | 'uid'> | null = null;
        try {
            // Because a user's email is unique across the entire project,
            // we can search the 'users' collection group to find them, regardless of tenant.
            const usersCollectionGroup = collectionGroup(db, 'users');
            const q = query(usersCollectionGroup, where("email", "==", firebaseUser.email));
            const userSnapshot = await getDocs(q);

            if (!userSnapshot.empty) {
                // Should only be one result, but we'll take the first one.
                const userDoc = userSnapshot.docs[0];
                const userData = userDoc.data();
                foundUser = {
                    id: userDoc.id,
                    email: firebaseUser.email!,
                    name: userData.name || firebaseUser.displayName || 'Admin User',
                    tenant: userData.tenant,
                };
            }
        } catch (error) {
            console.error("Error fetching user data from Firestore:", error);
        }
        
        if (foundUser) {
            setUser({
              ...foundUser,
              uid: firebaseUser.uid,
              role: userRole,
            });
        } else {
            // Fallback for demo environment if user not in Firestore (e.g., initial seed user)
            // This allows the very first user to log in and use the app to create data.
             setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: 'Admin User',
              role: userRole, // Default to admin for the first user
              tenant: 'Global Maritime', // Default tenant for the first user
              id: firebaseUser.uid, 
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
