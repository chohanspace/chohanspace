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
import { generateCaseStudy } from "@/app/tool/actions";
import { Loader2, Wand2, FileText } from "lucide-react";
import { type CaseStudyOutput } from "@/ai/flows/case-study-generator";

const formSchema = z.object({
    projectName: z.string().min(3, "Please provide a project name."),
    projectGoals: z.string().min(10, "Please describe the project goals in at least 10 characters."),
    technologiesUsed: z.string().min(3, "Please list the technologies used."),
    outcome: z.string().min(10, "Please describe the outcome in at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function CaseStudyGenerator() {
    const [caseStudy, setCaseStudy] = useState<CaseStudyOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectName: "",
            projectGoals: "",
            technologiesUsed: "",
            outcome: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setCaseStudy(null);
        setError(null);
        
        try {
            const result = await generateCaseStudy(values);
            if(result){
                setCaseStudy(result);
            } else {
                setError("Sorry, we couldn't generate a case study at this time. Please try again later.");
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
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>Fill out the form below to generate your case study.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="projectName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 'E-commerce Platform Overhaul'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="projectGoals"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Goals</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., 'To increase user conversion rate by 20% and improve mobile responsiveness...'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="technologiesUsed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technologies Used</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 'Next.js, TypeScript, Tailwind CSS, Stripe'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="outcome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Outcome</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., 'Successfully launched the new platform, leading to a 25% increase in conversion and a 50% improvement in page load speed...'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Generate Case Study
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
                    <p className="mt-2 text-muted-foreground">AI is writing your case study...</p>
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

            {caseStudy && (
                <Card className="mt-8 animate-fadeIn">
                    <CardHeader>
                        <CardTitle className="flex items-center text-accent">
                            <FileText className="mr-2 h-6 w-6" /> {caseStudy.caseStudyTitle}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert whitespace-pre-wrap">
                        {caseStudy.caseStudyBody}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
