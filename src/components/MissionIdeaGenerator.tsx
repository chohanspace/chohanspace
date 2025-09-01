'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMissionIdea } from "@/app/tool/actions";
import { Loader2, Rocket, Wand2 } from "lucide-react";
import { type MissionIdeaOutput } from "@/ai/flows/mission-idea-generator";

const formSchema = z.object({
    keywords: z.string().min(3, "Please provide at least 3 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function MissionIdeaGenerator() {
    const [idea, setIdea] = useState<MissionIdeaOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            keywords: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setIdea(null);
        setError(null);
        
        try {
            const result = await generateMissionIdea(values);
            if(result){
                setIdea(result);
            } else {
                setError("Sorry, we couldn't generate a mission idea at this time. Please try again later.");
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
                    <CardTitle>Mission Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="keywords"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter some keywords</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., 'Jupiter, moons, life detection'"
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
                                        Generate Mission
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
                    <p className="mt-2 text-muted-foreground">AI is drafting a mission...</p>
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

            {idea && (
                <Card className="mt-8 animate-fadeIn">
                    <CardHeader>
                        <CardTitle className="flex items-center text-accent">
                           <Rocket className="mr-2 h-6 w-6" /> {idea.missionName}
                        </CardTitle>
                        <CardDescription>{idea.missionObjective}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{idea.missionDetails}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
