
'use client';

import { getCertificates } from './firestore';
import type { CertificateWithStatus } from './types';
import { differenceInDays } from 'date-fns';

export type Notification = {
    id: string;
    type: 'Certificate' | 'Maintenance';
    icon: React.ReactNode;
    title: string;
    description: string;
    date: Date;
    read: boolean;
};

function getCertificateStatus(expiryDate: string): { status: 'Valid' | 'Expiring Soon' | 'Expired', daysUntilExpiry: number } {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = differenceInDays(expiry, today);

  if (daysUntilExpiry < 0) {
    return { status: 'Expired', daysUntilExpiry };
  }
  if (daysUntilExpiry <= 30) {
    return { status: 'Expiring Soon', daysUntilExpiry };
  }
  return { status: 'Valid', daysUntilExpiry };
}


export async function getCertificateNotifications(): Promise<CertificateWithStatus[]> {
    try {
        const certificates = await getCertificates();
        const expiringCerts = certificates
            .map(cert => {
                const { status, daysUntilExpiry } = getCertificateStatus(cert.expiryDate);
                return { ...cert, status, daysUntilExpiry };
            })
            .filter(cert => cert.status === 'Expiring Soon' || cert.status === 'Expired')
            .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
        
        return expiringCerts;

    } catch (error) {
        console.error("Error fetching certificate notifications:", error);
        return [];
    }
}
