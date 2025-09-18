
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, Mail, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type LoginStep = 'password' | 'select_email' | 'otp';

export default function AdminLoginPage() {
    const [step, setStep] = useState<LoginStep>('password');
    const [password, setPassword] = useState('');
    const [selectedEmail, setSelectedEmail] = useState('');
    const [emailOptions, setEmailOptions] = useState<string[]>([]);
    const [otp, setOtp] = useState('');
    const [preAuthToken, setPreAuthToken] = useState('');
    const [otpToken, setOtpToken] = useState('');
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
            const data = await res.json();
            if (res.ok && data.success) {
                setPreAuthToken(data.preAuthToken);
                setEmailOptions(data.emailOptions);
                setStep('select_email');
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

    const handleEmailSelectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmail) {
            toast({ title: 'Error', description: 'Please select an email address.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/login/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: selectedEmail, preAuthToken }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setOtpToken(data.otpToken);
                toast({ title: 'OTP Sent', description: `An OTP has been sent to ${selectedEmail}.` });
                setStep('otp');
            } else {
                toast({ title: 'Error', description: data.message || 'Failed to send OTP.', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/login/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, otpToken }),
            });
            if (res.ok) {
                router.refresh();
            } else {
                toast({ title: 'Login Failed', description: 'Invalid or expired OTP.', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }

    const renderStep = () => {
        switch (step) {
            case 'password':
                return (
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
                             {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Authenticating...</> : "Unlock"}
                        </Button>
                    </form>
                );
            case 'select_email':
                return (
                     <form onSubmit={handleEmailSelectSubmit} className="space-y-6">
                        <CardHeader className="text-center p-0 mb-6">
                            <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                                <Mail size={32} />
                            </div>
                            <CardTitle>Two-Factor Authentication</CardTitle>
                            <CardDescription>Select an email to receive your one-time password.</CardDescription>
                        </CardHeader>
                         <RadioGroup value={selectedEmail} onValueChange={setSelectedEmail} className="space-y-2">
                             {emailOptions.map(email => (
                                 <Label key={email} className="flex items-center gap-4 border rounded-md p-3 has-[:checked]:bg-accent has-[:checked]:border-primary">
                                     <RadioGroupItem value={email} id={email} />
                                     {email}
                                 </Label>
                             ))}
                         </RadioGroup>
                         <Button type="submit" className="w-full" disabled={isLoading || !selectedEmail}>
                             {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : "Send OTP"}
                         </Button>
                     </form>
                );
            case 'otp':
                return (
                     <form onSubmit={handleOtpSubmit} className="space-y-4">
                         <CardHeader className="text-center p-0 mb-6">
                            <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                                <KeyRound size={32} />
                            </div>
                            <CardTitle>Enter One-Time Password</CardTitle>
                            <CardDescription>Check {selectedEmail} for your code.</CardDescription>
                        </CardHeader>
                         <div className="space-y-2">
                             <Label htmlFor="otp">6-Digit Code</Label>
                             <Input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" required maxLength={6} />
                         </div>
                         <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : "Verify & Log In"}
                         </Button>
                     </form>
                );
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background animate-fadeIn">
            <Card className="w-full max-w-sm">
                <CardContent className="pt-6">
                    {renderStep()}
                </CardContent>
            </Card>
        </div>
    );
}
