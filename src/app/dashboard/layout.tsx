
'use client';

import Link from 'next/link';
import {
  PanelLeft,
  Search,
  LogOut,
  Bell,
  FileWarning,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DashboardIcon,
  CrewIcon,
  FleetIcon,
  CertificateIcon,
  AdminIcon,
  AiIcon,
  Logo,
  WhatsNewIcon,
  RouteIcon,
  MaintenanceIcon,
  SafetyIcon,
  SchedulingIcon,
  ReportingIcon,
  NotificationsIcon,
  MusicIcon,
  SettingsIcon,
  InventoryIcon,
} from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from './protected-route';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { subscribeToNotifications } from '@/lib/firestore';
import type { Notification } from '@/lib/types';
import { useTenant } from '@/hooks/use-tenant';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Skeleton } from '@/components/ui/skeleton';

const getAvatarFallback = (name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const { tenantId } = useTenant();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const unreadCount = notifications.filter(n => !n.isRead).length;


  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { href: '/dashboard/crew', label: 'Crew', icon: CrewIcon },
    { href: '/dashboard/fleet', label: 'Fleet', icon: FleetIcon },
    { href: '/dashboard/certificates', label: 'Certificates', icon: CertificateIcon },
    { href: '/dashboard/routes', label: 'Routes', icon: RouteIcon },
    { href: '/dashboard/scheduling', label: 'Scheduling', icon: SchedulingIcon },
    { href: '/dashboard/reporting', label: 'Reporting', icon: ReportingIcon },
    { href: '/dashboard/inventory', label: 'Inventory', icon: InventoryIcon },
    { type: 'separator', label: 'AI Assistants' },
    { href: '/dashboard/crew-ai', label: 'Crew AI', icon: AiIcon },
    { href: '/dashboard/route-ai', label: 'Route AI', icon: RouteIcon },
    { href: '/dashboard/maintenance-ai', label: 'Maintenance AI', icon: MaintenanceIcon },
    { href: '/dashboard/safety-ai', label: 'Safety AI', icon: SafetyIcon },
    { href: '/dashboard/shanty-ai', label: 'Shanty AI', icon: MusicIcon },
    { type: 'separator', label: 'Settings' },
    { href: '/dashboard/admin', label: 'Admin', icon: AdminIcon },
    { href: '/dashboard/notifications', label: 'Notifications', icon: NotificationsIcon },
    { href: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
  ];
  const auth = getAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!tenantId) return;

    setIsLoadingNotifications(true);
    const unsubscribe = subscribeToNotifications(tenantId, (notifs) => {
      setNotifications(notifs);
      setIsLoadingNotifications(false);
    }, (error) => {
      console.error("Failed to subscribe to notifications", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load notifications.' });
      setIsLoadingNotifications(false);
    });

    return () => {
        unsubscribe.then(unsub => unsub());
    }
  }, [tenantId, toast]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Also clear tenant from session storage on sign out
      sessionStorage.removeItem('marinasuite-tenantId');
      router.push('/login');
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out.",
      });
    }
  };


  return (
    <ProtectedRoute>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-card md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo className="h-6 w-6 text-primary" />
                <span className="">MarinaSuite</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navLinks.map((link, index) => 
                  link.type === 'separator' ? (
                    <div key={index} className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{link.label}</div>
                  ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>What's New</CardTitle>
                    <Badge variant="secondary">v6.1.0</Badge>
                  </div>
                  <CardDescription>
                    Check out the latest features and updates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Link href="/src/CHANGELOG.md" target="_blank">
                    <Button size="sm" className="w-full">
                      <WhatsNewIcon className="mr-2" />
                      View Changelog
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="sr-only">MarinaSuite</span>
                  </Link>
                  {navLinks.map((link) => 
                    link.type === 'separator' ? null : (
                    <Link
                      key={link.href}
                      href={link.href!}
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Need Help?</CardTitle>
                      <CardDescription>
                        Contact support for assistance with any issues.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" className="w-full">
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                   {unreadCount > 0 && (
                     <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs" variant="destructive">
                       {unreadCount}
                     </Badge>
                   )}
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 {isLoadingNotifications ? (
                    <DropdownMenuItem>Loading...</DropdownMenuItem>
                 ) : notifications.filter(n => !n.isRead).length > 0 ? (
                    notifications.filter(n => !n.isRead).slice(0, 3).map(notif => (
                      <DropdownMenuItem key={notif.id} asChild>
                        <Link href="/dashboard/notifications" className="flex flex-col items-start gap-1">
                          <p className="font-medium text-destructive">
                             {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground whitespace-normal">
                              {notif.description}
                          </p>
                        </Link>
                      </DropdownMenuItem>
                    ))
                 ) : (
                    <DropdownMenuItem>No new notifications</DropdownMenuItem>
                 )}
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                   <Link href="/dashboard/notifications" className="w-full">
                      <Button size="sm" className="w-full">View All Notifications</Button>
                   </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {isUserLoading ? (
                  <Skeleton className="h-10 w-10 rounded-full" />
                ) : (
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} alt={user?.name} />
                    <AvatarFallback>{getAvatarFallback(user?.name)}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name || 'User'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
