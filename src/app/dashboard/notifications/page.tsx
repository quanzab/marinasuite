
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileWarning, Check } from "lucide-react";
import { subscribeToNotifications, markNotificationAsRead } from '@/lib/firestore';
import type { Notification } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useTenant } from '@/hooks/use-tenant';
import { useToast } from '@/hooks/use-toast';


export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { tenantId } = useTenant();
    const { toast } = useToast();

    useEffect(() => {
        if (!tenantId) return;
        setIsLoading(true);
        const unsubscribe = subscribeToNotifications(tenantId, (notifs) => {
            setNotifications(notifs);
            setIsLoading(false);
        }, (error) => {
            console.error("Failed to subscribe to notifications:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load notifications.' });
            setIsLoading(false);
        });

        return () => {
            unsubscribe.then(unsub => unsub());
        }
    }, [tenantId, toast]);

    const handleMarkAsRead = async (id: string) => {
        if (!tenantId) return;
        try {
            await markNotificationAsRead(tenantId, id);
            toast({ title: "Success", description: "Notification marked as read." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: "Failed to mark notification as read." });
        }
    };

    const getIcon = (type: string) => {
        if (type.includes('Expired')) {
            return <FileWarning className="h-6 w-6 text-red-500" />;
        }
        return <FileWarning className="h-6 w-6 text-yellow-500" />;
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
                            <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-muted" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex items-start space-x-4">
                            <div>
                            <span className={`relative flex h-10 w-10 items-center justify-center rounded-full ${notification.isRead ? 'bg-muted' : 'bg-primary/10'}`}>
                                {getIcon(notification.title)}
                            </span>
                            </div>
                            <div className={`min-w-0 flex-1 py-1.5 ${notification.isRead ? 'opacity-60' : ''}`}>
                            <div className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">{notification.title}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                             <p className="mt-1 text-xs text-muted-foreground">
                                {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}
                            </p>
                            </div>
                           {!notification.isRead && (
                                <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as Read
                                </Button>
                           )}
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
