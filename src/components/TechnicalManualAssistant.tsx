'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { answerTechnicalQuestion } from "@/app/tool/actions";
import { Loader2, Wand2, BookCheck } from "lucide-react";
import { type TechnicalQuestionOutput } from "@/ai/flows/technical-manual-assistant";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";

const formSchema = z.object({
    document: z.string().min(100, "Please provide a document of at least 100 characters."),
    question: z.string().min(5, "Please ask a question of at least 5 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function TechnicalManualAssistant() {
    const [result, setResult] = useState<TechnicalQuestionOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            document: "",
            question: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setResult(null);
        setError(null);
        
        try {
            const apiResponse = await answerTechnicalQuestion(values);
            if(apiResponse){
                setResult(apiResponse);
            } else {
                setError("Sorry, we couldn't get an answer at this time. Please try again later.");
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
                    <CardTitle>Document Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="document"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technical Document</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Paste the full text of the technical manual here..."
                                                className="min-h-[250px] font-mono text-xs"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Question</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., 'What is the maximum operational temperature for the RCS thrusters?'"
                                                className="min-h-[50px]"
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
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Get Answer
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
                    <p className="mt-2 text-muted-foreground">AI is reading the document...</p>
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
                           <BookCheck className="mr-2 h-6 w-6 text-accent" /> AI Assistant's Answer
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-lg">{result.answer}</p>
                        
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <Label>Confidence Score</Label>
                                <span className="text-sm font-bold">{Math.round(result.confidenceScore * 100)}%</span>
                            </div>
                            <Progress value={result.confidenceScore * 100} />
                        </div>

                        {result.relevantSection && (
                             <div>
                                <h4 className="font-semibold mb-2">Relevant Section from Document:</h4>
                                <blockquote className="border-l-4 border-muted-foreground pl-4 italic text-muted-foreground">
                                    {result.relevantSection}
                                </blockquote>
                             </div>
                        )}

                    </CardContent>
                </Card>
            )}
        </div>
    );
}
