
'use client';

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { personalizeContentAction } from "@/app/tool/actions";
import { Loader2, Wand2, PlusCircle, X, ChevronsRight, FileCode } from "lucide-react";
import { type PersonalizationOutput } from "@/ai/flows/personalization-engine";
import { Badge } from "./ui/badge";

const formSchema = z.object({
    userHistory: z.array(z.object({ value: z.string().url("Please enter a valid URL.") })),
    userLocation: z.string().optional(),
    originalHeadline: z.string().min(5, "Please enter an original headline."),
});

type FormValues = z.infer<typeof formSchema>;

export function PersonalizationEngine() {
    const [result, setResult] = useState<PersonalizationOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userHistory: [{ value: "/projects" }, { value: "/tool/mission-generator" }],
            userLocation: "San Francisco, CA",
            originalHeadline: "Building Exceptional Digital Experiences",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "userHistory"
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setResult(null);
        setError(null);
        
        const submissionData = {
            ...values,
            userHistory: values.userHistory.map(item => item.value)
        }

        try {
            const apiResponse = await personalizeContentAction(submissionData);
            if(apiResponse){
                setResult(apiResponse);
            } else {
                setError("Sorry, we couldn't personalize the content at this time. Please try again later.");
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
                    <CardTitle>Simulation Input</CardTitle>
                    <CardDescription>Provide simulated user data to see the personalization in action.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                             <FormField
                                control={form.control}
                                name="originalHeadline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Original Headline</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Welcome to our Website" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <FormLabel>Simulated User Browsing History</FormLabel>
                                {fields.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`userHistory.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-2 mt-2">
                                                <FormControl>
                                                    <Input placeholder="/blog/my-post" {...field} />
                                                </FormControl>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => append({ value: "" })}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Visited Page
                                </Button>
                            </div>
                            <FormField
                                control={form.control}
                                name="userLocation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Location (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., London, UK" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                           
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Personalize
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
                    <p className="mt-2 text-muted-foreground">AI is tailoring the experience...</p>
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

            {result && (
                <Card className="mt-8 animate-fadeIn">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                           AI Personalization Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Personalized Headline</h3>
                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-secondary/50">
                                <p className="text-muted-foreground line-through">{form.getValues('originalHeadline')}</p>
                                <ChevronsRight className="h-6 w-6 text-primary shrink-0" />
                                <p className="text-lg font-bold text-primary">{result.personalizedHeadline}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Suggested Content for User</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.suggestedContentIds.map(id => (
                                    <Badge key={id} variant="outline" className="flex items-center gap-2 text-base">
                                        <FileCode className="h-4 w-4"/>
                                        {id}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        
                         <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Reasoning</h3>
                            <p className="text-sm text-muted-foreground p-4 border rounded-lg bg-background italic">
                                "{result.reasoning}"
                            </p>
                         </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
