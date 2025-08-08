'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('admin@marinasuite.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For this demo, we'll use a pre-existing test user.
      // In a real app, you would implement user creation.
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'An unknown error occurred.';
      if (error instanceof Error) {
        // In a real app, you would have more specific error handling.
        errorMessage = 'Invalid email or password. Please try again.';
      }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="relative h-full hidden lg:block">
        <Image
          src="https://img.freepik.com/premium-photo/vastness-ocean-unfolds-aerial-cargo-ship-view-vertical-mobile-wallpaper_896558-10976.jpg"
          alt="Maritime port"
          data-ai-hint="cargo ship ocean"
          fill
          style={{objectFit: 'cover'}}
          quality={100}
        />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-4xl font-bold">MarinaSuite</h2>
          <p className="text-lg mt-2 drop-shadow-md">Your all-in-one solution for maritime management.</p>
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
                  <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
