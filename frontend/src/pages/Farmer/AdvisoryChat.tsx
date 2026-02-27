import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sprout, Info, RefreshCw, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AdvisoryChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello Farmer! I'm your AgroSmart AI advisor (Powered by Groq Llama-3.3). How can I help you today? You can ask about irrigation, fertilizers, or pest control.",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const currentInput = input;
        const userMsg: Message = {
            id: Date.now().toString(),
            text: currentInput,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await axios.post('http://localhost:8000/api/chat/advisory', { message: currentInput });

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: res.data.response,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            const errMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting to the advisory server. Please ensure the backend is running.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] p-6 max-w-5xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-primary/10 border border-primary/20 p-4 rounded-3xl shadow-xl shadow-primary/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
                        <Bot size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">AgroSmart AI Advisor</h2>
                        <p className="text-xs text-primary-light font-black flex items-center gap-1 uppercase tracking-widest">
                            <Zap size={12} fill="currentColor" />
                            Live Groq Intelligence
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-xl text-white/40"><Info size={20} /></button>
                    <button onClick={() => setMessages([messages[0]])} className="p-2 hover:bg-white/5 rounded-xl text-white/40 group"><RefreshCw size={20} className="group-active:rotate-180 transition-transform" /></button>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-hide mb-6"
            >
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.sender === 'user' ? 'bg-primary' : 'bg-white/5 border border-white/10'
                                    }`}>
                                    {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} className="text-primary-light" />}
                                </div>
                                <div className={`p-5 rounded-3xl ${msg.sender === 'user'
                                    ? 'bg-primary/20 border border-primary/30 rounded-tr-none'
                                    : 'glass-card border-white/10 rounded-tl-none'
                                    }`}>
                                    <p className="leading-relaxed whitespace-pre-wrap text-white/90">{msg.text}</p>
                                    <p className="text-[10px] text-white/20 mt-3 font-black uppercase tracking-[0.2em]">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Bot size={20} className="text-primary-light" />
                                </div>
                                <div className="glass-card py-4 px-8 rounded-3xl rounded-tl-none flex gap-1.5 items-center">
                                    <span className="w-2 h-2 bg-primary-light rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-primary-light rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-2 h-2 bg-primary-light rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="relative z-10 flex gap-4">
                <div className="relative flex-1 group">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about soil, crops, or pests..."
                        className="w-full bg-white/5 border border-white/10 rounded-3xl pl-8 pr-16 py-6 focus:outline-none focus:border-primary transition-all group-hover:border-white/20 text-lg placeholder:text-white/20"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                        <button type="button" className="p-2 text-white/10 hover:text-white transition-colors">
                            <Sprout size={28} />
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="bg-primary hover:bg-primary-light disabled:opacity-30 disabled:cursor-not-allowed text-white px-8 rounded-3xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center group"
                >
                    {isTyping ? <Loader2 className="animate-spin" /> : <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
            </form>

            {/* Quick Actions */}
            <div className="mt-6 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                <QuickChip text="Optimal Irrigation?" onClick={() => setInput("When should I irrigate my crops based on current weather?")} />
                <QuickChip text="Profit Maximization?" onClick={() => setInput("How can I increase my profit margins for the next Kharif season?")} />
                <QuickChip text="Pest Warnings?" onClick={() => setInput("Are there any common pests I should watch out for right now?")} />
                <QuickChip text="Soil Health Advice?" onClick={() => setInput("My soil pH is 7.2. What crops are best for this?")} />
            </div>
        </div>
    );
};

const QuickChip = ({ text, onClick }: any) => (
    <button
        onClick={onClick}
        className="whitespace-nowrap bg-white/2 border border-white/10 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white/40 hover:text-white hover:bg-primary/20 hover:border-primary/40 transition-all"
    >
        {text}
    </button>
);

export default AdvisoryChat;
