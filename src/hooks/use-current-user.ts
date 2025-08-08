
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
        
        // When auth state changes, force a token refresh to get latest custom claims.
        const idTokenResult = await firebaseUser.getIdTokenResult(true);
        const claims = idTokenResult.claims;
        const userRole = claims.role || 'Viewer'; // Default to 'Viewer' if no role claim

        let foundUser: Omit<CurrentUser, 'role' | 'uid'> | null = null;
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
                        email: firebaseUser.email!,
                        name: userData.name || firebaseUser.displayName || 'Admin User',
                        tenant: userData.tenant,
                    };
                    break;
                }
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
            // Fallback for demo environment if user not in Firestore
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || 'Admin User',
              role: userRole,
              tenant: 'Global Maritime', // Default tenant
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
