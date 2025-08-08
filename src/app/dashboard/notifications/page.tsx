
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellRing, Check, FileWarning, Wrench } from "lucide-react";


const notifications = [
    {
        icon: <FileWarning className="h-6 w-6 text-yellow-500" />,
        title: 'Certificate Expiring Soon',
        description: 'The "Ship Security Officer" certificate for John Doe is set to expire in 29 days. Please take action to renew it.',
        date: '2 hours ago',
        read: false,
    },
    {
        icon: <Wrench className="h-6 w-6 text-blue-500" />,
        title: 'Vessel Maintenance Due',
        description: 'Vessel "Sea Serpent" (IMO: 9234567) is due for its scheduled maintenance. Please arrange for service.',
        date: '1 day ago',
        read: false,
    },
    {
        icon: <FileWarning className="h-6 w-6 text-red-500" />,
        title: 'Certificate Expired',
        description: 'The "ECDIS Generic" certificate for Jane Smith has expired. Immediate action is required.',
        date: '3 days ago',
        read: true,
    },
];

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Notifications</h1>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
                Here are the latest updates and alerts.
            </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flow-root">
              <ul className="-mb-8">
                {notifications.map((notification, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== notifications.length - 1 ? (
                        <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex items-start space-x-4">
                        <div>
                          <span className={`relative flex h-10 w-10 items-center justify-center rounded-full ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                            {notification.icon}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 py-1.5">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium text-foreground">{notification.title}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                           <p className="mt-1 text-xs text-muted-foreground">{notification.date}</p>
                        </div>
                         {!notification.read && (
                            <Badge variant="destructive" className="mt-2">New</Badge>
                         )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

