'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateCrisisComm } from "@/app/tool/actions";
import { Loader2, Wand2, Twitter } from "lucide-react";
import { type CrisisCommOutput } from "@/ai/flows/crisis-communicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formSchema = z.object({
    missionName: z.string().min(3, "Please provide a mission name."),
    anomaly: z.string().min(10, "Please describe the anomaly in at least 10 characters."),
    severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
});

type FormValues = z.infer<typeof formSchema>;

export function CrisisCommunicator() {
    const [statement, setStatement] = useState<CrisisCommOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            missionName: "",
            anomaly: "",
            severity: "Medium",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setStatement(null);
        setError(null);
        
        try {
            const result = await generateCrisisComm(values);
            if(result){
                setStatement(result);
            } else {
                setError("Sorry, we couldn't generate a statement at this time. Please try again later.");
            }
        } catch (e) {
            setError("An unexpected error occurred. Please check the console for more details.");
            console.error(e);
        }
        
        setIsLoading(false);
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Anomaly Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="missionName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mission Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 'Mars Rover Curiosity II'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="anomaly"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Anomaly Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., 'Unexpected loss of communication with the rover...'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="severity"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Severity Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select a severity level" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Critical">Critical</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Drafting Statement...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Generate Statement
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {isLoading && (
                 <div className="text-center p-8">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">AI is drafting a response...</p>
                 </div>
            )}
            
            {error && (
                <Card className="mt-8 border-destructive bg-destructive/10">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                    </CardContent>
                </Card>
            )}

            {statement && (
                <div className="mt-8 space-y-8 animate-fadeIn">
                     <Card>
                        <CardHeader>
                            <CardTitle>{statement.statementTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className="prose dark:prose-invert">
                            <p>{statement.statementBody}</p>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Twitter className="mr-2 h-5 w-5 text-blue-500" /> Social Media Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{statement.socialMediaPost}</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
