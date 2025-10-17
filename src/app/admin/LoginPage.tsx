
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            
            if (res.ok) {
                router.refresh();
            } else {
                toast({
                    title: 'Login Failed',
                    description: 'Invalid password. Please try again.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
             toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-background animate-fadeIn">
            <Card className="w-full max-w-sm">
                <CardContent className="pt-6">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <CardHeader className="text-center p-0 mb-6">
                             <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                                <Lock size={32} />
                            </div>
                            <CardTitle>Admin Access</CardTitle>
                            <CardDescription>Please enter the admin password.</CardDescription>
                        </CardHeader>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Authenticating...</> : "Log In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
