
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Bot, User, Loader2, Minus, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { answerQuery, sendChatTranscript } from '@/app/tool/actions';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type ChatState = 'closed' | 'open' | 'minimized';

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
type EmailFormValues = z.infer<typeof emailSchema>;

function EmailForm({ onEmailSubmit }: { onEmailSubmit: (email: string) => void }) {
    const form = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: '' },
    });

    function onSubmit(values: EmailFormValues) {
        onEmailSubmit(values.email);
    }
    
    return (
        <div className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
                <Mail size={32} />
            </div>
            <h3 className="font-semibold mb-2">Welcome to Chohan Space!</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Enter your email to start chatting. We'll send you a transcript of our conversation.
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Start Chat</Button>
                </form>
            </Form>
        </div>
    )
}


export function Chatbot() {
    const [chatState, setChatState] = useState<ChatState>('closed');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
        }
    }, [messages]);
    
    useEffect(() => {
        if (chatState === 'open' && email && messages.length === 0) {
            setMessages([
                { role: 'assistant', content: "Hello! I'm the Chohan Space assistant. How can I help you today?" }
            ]);
        }
    }, [chatState, messages.length, email]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await answerQuery({ query: input });
            if (result?.response) {
                const assistantMessage: Message = { role: 'assistant', content: result.response };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                 const errorMessage: Message = { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage: Message = { role: 'assistant', content: "An unexpected error occurred. Please try again." };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCloseChat = async () => {
        if (email) {
            const result = await sendChatTranscript({ email, messages });
            if (result.success) {
                toast({
                    title: "Transcript Sent",
                    description: "A copy of our conversation has been sent to your email.",
                });
            } else if (result.message !== 'No conversation to send.') {
                 toast({
                    title: "Error Sending Transcript",
                    description: result.message || "Could not send the email.",
                    variant: "destructive",
                });
            }
        }
        setChatState('closed');
        // Reset for next time
        setMessages([]);
        setEmail(null);
    }
    
    const handleEmailSubmit = (submittedEmail: string) => {
        setEmail(submittedEmail);
    }

    if (chatState === 'closed') {
        return (
            <div className="fixed bottom-0 right-0 m-6 z-50">
                <Button size="lg" className="rounded-full shadow-lg" onClick={() => setChatState('open')}>
                    <MessageSquare className="mr-2" />
                    Chat with Us
                </Button>
            </div>
        );
    }
    
    if (chatState === 'minimized') {
        return (
             <div className="fixed bottom-0 right-0 m-6 z-50">
                <Button size="icon" className="rounded-full shadow-lg h-14 w-14" onClick={() => setChatState('open')}>
                    <Bot size={24}/>
                    <span className="sr-only">Open Chat</span>
                </Button>
            </div>
        )
    }

    return (
        <div className={cn("fixed bottom-0 right-0 sm:m-6 z-50 transition-all duration-300 w-full h-full sm:h-auto sm:w-auto", chatState === 'open' ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none")}>
            <Card className="flex flex-col h-full sm:h-[600px] w-full sm:w-[400px] shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center text-lg"><Bot className="mr-2"/> Chohan Space Assistant</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setChatState('minimized')}>
                            <Minus className="h-4 w-4" />
                            <span className="sr-only">Minimize chat</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCloseChat}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close chat</span>
                        </Button>
                    </div>
                </CardHeader>
                
                {!email ? (
                    <EmailForm onEmailSubmit={handleEmailSubmit} />
                ) : (
                    <>
                        <ScrollArea className="flex-grow" ref={scrollAreaRef} viewportRef={viewportRef}>
                            <CardContent className="p-4 space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? "justify-end" : "justify-start")}>
                                            {message.role === 'assistant' && (
                                            <div className="bg-primary text-primary-foreground p-2 rounded-full">
                                                <Bot size={16} />
                                            </div>
                                        )}
                                        <div className={cn("max-w-[80%] rounded-lg px-4 py-2 text-sm", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
                                            <p>{message.content}</p>
                                        </div>
                                        {message.role === 'user' && (
                                            <div className="bg-muted text-muted-foreground p-2 rounded-full">
                                                <User size={16} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                    {isLoading && (
                                    <div className="flex items-start gap-3 justify-start">
                                        <div className="bg-primary text-primary-foreground p-2 rounded-full">
                                            <Bot size={16} />
                                        </div>
                                        <div className={cn("max-w-[80%] rounded-lg px-4 py-2 text-sm bg-secondary text-secondary-foreground")}>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </ScrollArea>
                        <CardFooter>
                            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    disabled={isLoading}
                                />
                                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}
