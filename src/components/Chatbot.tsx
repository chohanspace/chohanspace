'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { chat } from '@/ai/flows/chatbot-flow';
import type { ChatMessage } from '@/lib/data';
import { saveChatTranscript } from '@/app/actions';

const initialMessage: ChatMessage = {
    role: 'model',
    content: "Hello! I'm the AI assistant for Chohan Space. How can I help you today?"
};

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaViewportRef.current) {
            scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
        }
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    // Save transcript when chat closes
    useEffect(() => {
        if (!isOpen && messages.length > 1) { // Only save if there's a conversation
            saveChatTranscript(messages);
            setMessages([initialMessage]); // Reset for next time
        }
    }, [isOpen, messages]);

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

    return (
        <>
            <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300", isOpen ? "scale-0" : "scale-100")}>
                <Button size="icon" className="rounded-full w-16 h-16 shadow-lg" onClick={() => setIsOpen(true)}>
                    <MessageCircle className="h-8 w-8" />
                    <span className="sr-only">Open Chat</span>
                </Button>
            </div>

            <div className={cn("fixed bottom-6 right-6 z-50 w-full max-w-sm transition-all duration-300", isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none")}>
                <Card className="flex flex-col h-[60vh] shadow-xl">
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
                </Card>
            </div>
        </>
    );
}
