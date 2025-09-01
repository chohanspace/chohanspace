'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSuggestions } from "@/app/tool/actions";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { type SuggestContentOutput } from "@/ai/flows/content-suggestion-tool";


const formSchema = z.object({
    projectDescription: z.string().min(20, "Please provide a description of at least 20 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function ContentSuggestionTool() {
    const [suggestions, setSuggestions] = useState<SuggestContentOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectDescription: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setSuggestions(null);
        setError(null);
        
        try {
            const result = await generateSuggestions(values);
            if(result){
                setSuggestions(result);
            } else {
                setError("Sorry, we couldn't generate suggestions at this time. Please try again later.");
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
                    <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="projectDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter your project description below</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., 'A mobile app that helps users track their daily water intake and sends reminders...'"
                                                className="min-h-[150px]"
                                                {...field}
                                            />
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
                                        Generate Suggestions
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
                    <p className="mt-2 text-muted-foreground">AI is thinking...</p>
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

            {suggestions && (
                <div className="mt-8 space-y-8 animate-fadeIn">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Sparkles className="mr-2 h-5 w-5 text-accent" /> Suggested Topics</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            {suggestions.suggestedTopics.map((topic) => (
                                <Badge key={topic} variant="outline" className="text-base px-3 py-1">{topic}</Badge>
                            ))}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Sparkles className="mr-2 h-5 w-5 text-accent" /> Suggested Keywords</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            {suggestions.suggestedKeywords.map((keyword) => (
                                <Badge key={keyword} variant="secondary" className="text-base px-3 py-1">{keyword}</Badge>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
