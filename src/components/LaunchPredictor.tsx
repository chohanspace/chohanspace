'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { predictLaunchSuccess } from "@/app/tool/actions";
import { Loader2, Wand2, Gauge, AlertTriangle, CheckCircle2 } from "lucide-react";
import { type LaunchSuccessOutput } from "@/ai/flows/launch-success-predictor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";

const formSchema = z.object({
    weather: z.enum(['Clear', 'Light Clouds', 'Heavy Clouds', 'Rain', 'Thunderstorms']),
    rocketType: z.enum(['Falcon 9', 'Atlas V', 'Astra', 'Electron', 'New Glenn']),
    payloadWeight: z.coerce.number().min(100, "Payload must be at least 100 kg.").max(50000, "Payload cannot exceed 50,000 kg."),
});

type FormValues = z.infer<typeof formSchema>;

export function LaunchPredictor() {
    const [prediction, setPrediction] = useState<LaunchSuccessOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            weather: "Clear",
            rocketType: "Falcon 9",
            payloadWeight: 4500,
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setPrediction(null);
        setError(null);
        
        try {
            const result = await predictLaunchSuccess(values);
            if(result){
                setPrediction(result);
            } else {
                setError("Sorry, we couldn't generate a prediction at this time. Please try again later.");
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
                    <CardTitle>Launch Parameters</CardTitle>
                    <CardDescription>Enter the mission details to predict launch success.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="weather"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weather Conditions</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Clear">Clear Skies</SelectItem>
                                        <SelectItem value="Light Clouds">Light Clouds</SelectItem>
                                        <SelectItem value="Heavy Clouds">Heavy Clouds</SelectItem>
                                        <SelectItem value="Rain">Rain</SelectItem>
                                        <SelectItem value="Thunderstorms">Thunderstorms</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rocketType"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rocket Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Falcon 9">Falcon 9</SelectItem>
                                        <SelectItem value="Atlas V">Atlas V</SelectItem>
                                        <SelectItem value="Astra">Astra</SelectItem>
                                        <SelectItem value="Electron">Electron</SelectItem>
                                        <SelectItem value="New Glenn">New Glenn</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="payloadWeight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payload Weight (kg)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g., 4500" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Calculating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Predict Success
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
                    <p className="mt-2 text-muted-foreground">AI is running simulations...</p>
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

            {prediction && (
                <Card className="mt-8 animate-fadeIn">
                    <CardHeader>
                        <CardTitle className="flex items-center text-accent">
                            <Gauge className="mr-2 h-6 w-6" /> AI Prediction
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <FormLabel>Success Probability</FormLabel>
                                <span className="text-lg font-bold">{Math.round(prediction.successProbability * 100)}%</span>
                            </div>
                            <Progress value={prediction.successProbability * 100} />
                        </div>

                         <div>
                            <h4 className="font-semibold mb-2">Reasoning:</h4>
                            <p className="text-muted-foreground">{prediction.reasoning}</p>
                         </div>

                        <div>
                            <h4 className="font-semibold mb-2">Recommendation:</h4>
                            <div className={`flex items-center p-3 rounded-md ${prediction.successProbability > 0.7 ? 'bg-green-500/10 text-green-700' : 'bg-amber-500/10 text-amber-700'}`}>
                                {prediction.successProbability > 0.7 ? <CheckCircle2 className="mr-2 h-5 w-5" /> : <AlertTriangle className="mr-2 h-5 w-5" />}
                                <p className="font-bold">{prediction.recommendation}</p>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
