
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Cloud Function to set custom claims when a user's role is created or updated in Firestore.
export const setUserRole = functions.firestore
  .document("orgs/{orgId}/users/{userId}")
  .onWrite(async (change, context) => {
    const userData = change.after.data();
    const userEmail = userData?.email;
    const userRole = userData?.role;

    if (!userEmail || !userRole) {
      console.log(`User data for ${context.params.userId} is missing email or role.`);
      return null;
    }

    try {
      const user = await admin.auth().getUserByEmail(userEmail);
      
      // Check if claims are already set to avoid unnecessary updates
      if (user.customClaims && user.customClaims.role === userRole) {
          console.log(`Claims for ${userEmail} are already up to date.`);
          return null;
      }
      
      console.log(`Setting custom claim for ${userEmail} to role: ${userRole}`);
      await admin.auth().setCustomUserClaims(user.uid, { role: userRole });
      
      return {
        result: `Custom claim for ${userEmail} has been set to ${userRole}.`,
      };
    } catch (error) {
      console.error("Error setting custom claims:", error);
      return null;
    }
  });
