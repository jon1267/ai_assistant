import { Head } from '@inertiajs/react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';


interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello there! I'm your Book Shop Assistant. How can I assist you today?" },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Simple message formatter (support bold && new lines)
    const formatMessage= (text: string) => {
        let formatted = text;
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\n/g, '<br />');

        return formatted;
    };

    // Auto-scroll to the bottom when new message is added
    useEffect(() => {
        //scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [message]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ query: userMessage }),
            });

            const data = await response.json();

            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: data.response || "Sorry, I couldn't process that." },
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: "Sorry, I encountered an error. Please try again later." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="relative flex h-full flex-1 flex-col gap-4 p-4">
                {/* Dashboard Widgets */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
                        >
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    ))}
                </div>

                {/* Main content */}
                <div className="relative min-h-100 flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>

                {/* Floating Chat Button */}
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-8 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-0 bg-zinc-900 text-zinc-50 shadow-2xl transition-transform hover:scale-110 dark:bg-zinc-100 dark:text-zinc-950"
                    >
                        <MessageCircle className="h-8 w-8" />
                    </button>
                )}

                {/* Chatbot Window */}
                {!isOpen && (
                    <div className="fixed bottom-8 right-8 w-100 h-150  bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4  duration-300">
                        {/* Chat Header*/}
                        <div className="p-4 bg-zinc-900 dark:bg-zinc-800 text-white flex justify-between items-center border-b border-zinc-800">
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-zinc-800 rounded-lg">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-sm tracking-tight">Book Shop AI Assistant</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size = "icon"
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white hover:bg-white/10"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg:zinc-50 dark:bg-zinc-950/50"
                        >
                            {message.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-8 h-8 right-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-zinc-900 text-white'} `}>
                                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </div>

                                        <div
                                            className={`max-w-80% rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-zinc-900 text-white rounded-br-none' : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-bl-none'}`}
                                        >
                                            <div
                                                className="prose prose-sm dark:prose-invert"
                                                dangerouslySetInnerHTML={{__html: formatMessage(msg.content)}}
                                            >

                                            </div>
                                        </div>

                                    </div>
                                ))
                            }

                            {isLoading && (
                                <div className="flex items-center gap-2 pl-10">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce " />
                                    </div>
                                    <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">AI is typing</p>
                                </div>
                            )}

                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 flex gap-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about books, its prices, or authors..."
                                className="bg-zinc-100 dark:bg-zinc-800 border-none focus-visible:ring-1 focus-visible:ring-zinc-400"
                                disabled={isLoading}
                            />

                            <Button type="submit" disabled={isLoading} size="icon" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900" >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>

                    </div>
                )}
            </div>
        </>
    );
}