import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Cloud Function to set custom claims when a user's role is created or updated in Firestore.
export const setCustomUserClaims = functions.firestore
  .document("orgs/{orgId}/users/{userId}")
  .onWrite(async (change, context) => {
    const userData = change.after.data();
    const beforeData = change.before.data();

    // Exit if the document was deleted or if email/role is missing.
    if (!userData || !userData.email || !userData.role) {
      console.log(`User data for ${context.params.userId} is incomplete. Exiting.`);
      return null;
    }

    // Exit if role hasn't changed to prevent unnecessary updates.
    if (beforeData && beforeData.role === userData.role) {
        console.log(`Role for ${userData.email} has not changed. Exiting.`);
        return null;
    }

    try {
      const user = await admin.auth().getUserByEmail(userData.email);
      
      // Check if claims are already set to the target role.
      if (user.customClaims && user.customClaims.role === userData.role) {
          console.log(`Claims for ${userData.email} are already up to date.`);
          return null;
      }
      
      console.log(`Setting custom claim for ${userData.email} to role: ${userData.role}`);
      await admin.auth().setCustomUserClaims(user.uid, { role: userData.role });
      
      return {
        result: `Custom claim for ${userData.email} has been set to ${userData.role}.`,
      };
    } catch (error) {
      console.error("Error setting custom claims:", error);
      // If the user doesn't exist in Auth, we can't set claims.
      if ((error as any).code === 'auth/user-not-found') {
          console.warn(`User with email ${userData.email} not found in Firebase Auth.`);
      }
      return null;
    }
  });
