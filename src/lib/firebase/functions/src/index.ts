import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { differenceInDays, parseISO } from 'date-fns';

admin.initializeApp();
const db = admin.firestore();

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


// Scheduled function to check for expiring certificates and create persistent notifications.
export const checkCertificateExpirations = functions.pubsub
    .schedule("every 24 hours")
    .onRun(async (context) => {
        console.log("Running daily check for expiring certificates...");
        const today = new Date();

        try {
            const orgsSnapshot = await db.collection('orgs').get();
            
            for (const orgDoc of orgsSnapshot.docs) {
                const tenantId = orgDoc.id;
                console.log(`Checking tenant: ${tenantId}`);

                const certificatesSnapshot = await db.collection(`orgs/${tenantId}/certificates`).get();

                if (certificatesSnapshot.empty) {
                    continue;
                }

                for (const certDoc of certificatesSnapshot.docs) {
                    const certificate = certDoc.data();
                    const expiryDate = parseISO(certificate.expiryDate);
                    const daysUntilExpiry = differenceInDays(expiryDate, today);

                    const shouldNotify = (daysUntilExpiry >= 0 && daysUntilExpiry <= 30) || daysUntilExpiry < 0;

                    if (shouldNotify) {
                        const notificationsRef = db.collection(`orgs/${tenantId}/notifications`);
                        const existingNotifQuery = notificationsRef.where('relatedId', '==', certDoc.id);
                        const existingNotifSnapshot = await existingNotifQuery.get();

                        if (existingNotifSnapshot.empty) {
                             const type = daysUntilExpiry < 0 ? 'Certificate Expired' : 'Certificate Expiring Soon';
                             const description = daysUntilExpiry < 0 
                                ? `Certificate "${certificate.name}" expired ${Math.abs(daysUntilExpiry)} days ago.`
                                : `Certificate "${certificate.name}" will expire in ${daysUntilExpiry} days.`;

                            const notification = {
                                title: type,
                                description: description,
                                type: 'Certificate',
                                relatedId: certDoc.id,
                                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                                isRead: false,
                            };
                            await notificationsRef.add(notification);
                            console.log(`Created notification for certificate: ${certificate.name}`);
                        }
                    }
                }
            }

            console.log("Certificate expiration check completed successfully.");
            return null;
        } catch (error) {
            console.error("Error checking certificate expirations:", error);
            return null;
        }
    });
