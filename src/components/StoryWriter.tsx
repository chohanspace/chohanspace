'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateStory } from "@/app/tool/actions";
import { Loader2, Wand2 } from "lucide-react";
import { type StoryOutput } from "@/ai/flows/story-writer-flow";

const formSchema = z.object({
    prompt: z.string().min(10, "Please provide a prompt of at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function StoryWriter() {
    const [story, setStory] = useState<StoryOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setStory(null);
        setError(null);
        
        try {
            const result = await generateStory(values);
            if(result){
                setStory(result);
            } else {
                setError("Sorry, we couldn't generate content at this time. Please try again later.");
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
                    <CardTitle>Content Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter your content idea</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., 'An engaging blog post intro about the benefits of server-side rendering...'"
                                                className="min-h-[100px]"
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
                                        Writing...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Generate Content
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
                    <p className="mt-2 text-muted-foreground">AI is writing your content...</p>
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

            {story && (
                <Card className="mt-8 animate-fadeIn">
                    <CardHeader>
                        <CardTitle>{story.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert whitespace-pre-wrap">
                        <p>{story.story}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
