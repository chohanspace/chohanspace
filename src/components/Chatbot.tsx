
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Loader2, Bot, Mail } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { chat } from '@/ai/flows/chatbot-flow';
import type { ChatMessage } from '@/lib/data';
import { saveChatTranscript } from '@/app/actions';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const initialMessage: ChatMessage = {
    role: 'model',
    content: "Hello! I'm the AI assistant for Chohan Space. How can I help you today?"
};

type ChatState = 'request_email' | 'chatting';

const EmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});
type EmailFormValues = z.infer<typeof EmailSchema>;


export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatState, setChatState] = useState<ChatState>('request_email');
    const [userEmail, setUserEmail] = useState<string>();
    const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<EmailFormValues>({
        resolver: zodResolver(EmailSchema),
    });

    const scrollToBottom = () => {
        if (scrollAreaViewportRef.current) {
            scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
        }
    };
    
    useEffect(() => {
        if (chatState === 'chatting') {
            scrollToBottom();
        }
    }, [messages, chatState]);
    
    const handleClose = useCallback(() => {
        if (messages.length > 1) {
            saveChatTranscript(messages, userEmail);
        }
        // Reset state for next time
        setMessages([initialMessage]);
        setChatState('request_email');
        setUserEmail(undefined);
    }, [messages, userEmail]);

    useEffect(() => {
        if (!isOpen) {
           handleClose();
        }
    }, [isOpen, handleClose]);


    const handleSend = async () => {
        if (input.trim() === '') return;
        
        const userMessage: ChatMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat({ history: newMessages });
            const modelMessage: ChatMessage = { role: 'model', content: response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit: SubmitHandler<EmailFormValues> = (data) => {
        setUserEmail(data.email);
        setChatState('chatting');
    };
    
    const ChatContent = () => {
        if (chatState === 'request_email') {
            return (
                <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                     <div className="p-3 bg-primary text-primary-foreground rounded-full mb-4">
                        <Mail className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Welcome!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Please enter your email so we can send you a transcript of our conversation.
                    </p>
                    <form onSubmit={handleSubmit(handleEmailSubmit)} className="w-full space-y-2">
                        <Input
                            {...register("email")}
                            placeholder="your.email@example.com"
                            className={cn(errors.email && "border-destructive")}
                        />
                        {errors.email && <p className="text-xs text-destructive text-left">{errors.email.message}</p>}
                        <Button type="submit" className="w-full">Start Chat</Button>
                    </form>
                </div>
            )
        }
        
        return (
            <>
                <ScrollArea className="flex-grow p-4" viewportRef={scrollAreaViewportRef}>
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={cn("flex items-end gap-2", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                    {message.role === 'model' && (
                                         <div className="w-8 h-8 flex-shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                            <Bot className="h-5 w-5" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "max-w-[80%] rounded-lg px-4 py-2",
                                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                    )}>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                 <div className="flex items-end gap-2 justify-start">
                                     <div className="w-8 h-8 flex-shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div className="bg-muted rounded-lg px-4 py-3">
                                       <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                 </div>
                            )}
                        </div>
                    </ScrollArea>
                    <CardFooter className="pt-4 border-t">
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full items-center space-x-2">
                            <Input
                                id="message"
                                placeholder="Type your message..."
                                className="flex-1"
                                autoComplete="off"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </CardFooter>
            </>
        )
    }

    return (
        <>
            <div className={cn("fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-transform duration-300", isOpen ? "scale-0" : "scale-100")}>
                <Button size="icon" className="rounded-full w-16 h-16 shadow-lg" onClick={() => setIsOpen(true)}>
                    <MessageCircle className="h-8 w-8" />
                    <span className="sr-only">Open Chat</span>
                </Button>
            </div>

            <div className={cn("fixed z-50 transition-all duration-300 bottom-4 right-4 w-[calc(100vw-2rem)] max-w-sm md:bottom-6 md:right-6", isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none")}>
                <Card className="flex flex-col h-[70vh] max-h-[40rem] shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary text-primary-foreground rounded-full">
                                <Bot className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-lg">Chohan Space AI</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close Chat</span>
                        </Button>
                    </CardHeader>
                    <ChatContent />
                </Card>
            </div>
        </>
    );
}
