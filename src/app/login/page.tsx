'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    router.push('/dashboard');
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="relative h-full hidden lg:block">
        <Image
          src="https://placehold.co/1200x900.png"
          alt="Maritime port"
          data-ai-hint="maritime port"
          layout="fill"
          objectFit="cover"
          className="opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-8 left-8 text-primary-foreground">
          <h2 className="text-4xl font-bold">MarinaSuite</h2>
          <p className="text-lg mt-2">Your all-in-one solution for maritime management.</p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo className="w-12 h-12 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">Welcome to MarinaSuite</h1>
            <p className="text-balance text-muted-foreground">Enter your credentials to access your tenant</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Select your tenant and enter your email and password to login.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tenant">Tenant</Label>
                  <Input id="tenant" type="text" placeholder="Global Maritime" required defaultValue="Global Maritime" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required defaultValue="admin@marinasuite.com" />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required defaultValue="password" />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
