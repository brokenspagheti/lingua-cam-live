// src/components/QuickChat.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { MessageSquarePlus, Send, X } from 'lucide-react';

export default function QuickChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        eventBus.emit('danmu', trimmed);
        setText('');
        setIsOpen(false);
    };

    return (
        <div className="relative z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all hover:bg-white/20 hover:scale-105 active:scale-95 group"
                    title="Quick Danmu"
                >
                    <MessageSquarePlus className="w-6 h-6 group-hover:text-indigo-400 transition-colors" />
                </button>
            ) : (
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-2xl border border-white/10 p-2 rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSend();
                            if (e.key === 'Escape') setIsOpen(false);
                        }}
                        placeholder="Type quick message..."
                        className="bg-transparent border-none text-white placeholder:text-gray-500 focus:outline-none px-4 py-2 w-64 text-sm"
                    />
                    <div className="flex gap-1">
                        <button
                            onClick={handleSend}
                            disabled={!text.trim()}
                            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-all active:scale-95"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
