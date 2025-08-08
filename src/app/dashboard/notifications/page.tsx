
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileWarning, Wrench } from "lucide-react";
import { getCertificateNotifications } from '@/lib/notifications';
import type { CertificateWithStatus } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';


export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<CertificateWithStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchNotifications() {
            setIsLoading(true);
            const certs = await getCertificateNotifications();
            setNotifications(certs);
            setIsLoading(false);
        }
        fetchNotifications();
    }, []);

    const getIcon = (status: 'Expired' | 'Expiring Soon' | 'Valid') => {
        if (status === 'Expired') {
            return <FileWarning className="h-6 w-6 text-red-500" />;
        }
        return <FileWarning className="h-6 w-6 text-yellow-500" />;
    };

    const getDescription = (cert: CertificateWithStatus) => {
        if (cert.status === 'Expired') {
            return `The "${cert.name}" certificate expired ${Math.abs(cert.daysUntilExpiry)} days ago. Immediate action is required.`;
        }
        return `The "${cert.name}" certificate is set to expire in ${cert.daysUntilExpiry} days. Please take action to renew it.`;
    };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Notifications</h1>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
                Here are the latest updates and alerts regarding compliance and maintenance.
            </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flow-root">
              <ul className="-mb-8">
                 {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <li key={index}>
                           <div className="relative pb-8">
                                <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                <div className="relative flex items-start space-x-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="min-w-0 flex-1 py-1.5 space-y-2">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                </div>
                           </div>
                        </li>
                    ))
                 ) : notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                    <li key={notification.id}>
                        <div className="relative pb-8">
                        {index !== notifications.length - 1 ? (
                            <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex items-start space-x-4">
                            <div>
                            <span className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10`}>
                                {getIcon(notification.status)}
                            </span>
                            </div>
                            <div className="min-w-0 flex-1 py-1.5">
                            <div className="text-sm text-gray-500">
                                <span className="font-medium text-foreground">{notification.status === 'Expired' ? 'Certificate Expired' : 'Certificate Expiring Soon'}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{getDescription(notification)}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification.issueDate), { addSuffix: true })}</p>
                            </div>
                            <Badge variant="destructive" className="mt-2">New</Badge>
                        </div>
                        </div>
                    </li>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        You're all caught up. No new notifications.
                    </div>
                )}
              </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
