// src/components/ChatInput.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { eventBus } from '@/lib/eventBus';



interface ChatInputProps {
    viewerLang: string; // passed from parent (e.g., /live/page.tsx)
}

export default function ChatInput({ viewerLang }: ChatInputProps) {
    const [text, setText] = useState('');
    const [isSending, setIsSending] = useState(false);

    // RTL detection
    const isRTL = ['ar', 'he', 'ur'].some(lang => viewerLang.startsWith(lang));

    const sendMessage = async () => {
        const trimmed = text.trim();
        if (!trimmed || isSending) return;

        setIsSending(true);

        try {
            // Optional: translate outgoing message via Lingo (if you want multilingual chat)
            // const res = await translator.translate(trimmed, { targetLocale: 'en' }); // example
            // eventBus.emit('danmu', res.translatedText || trimmed);

            eventBus.emit('danmu', trimmed); // send raw for now
            setText('');
        } catch (err) {
            console.error('Send error:', err);
            alert('Failed to send message – try again');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4">
            <div className={`
        flex gap-3 items-center bg-black/60 backdrop-blur-md 
        px-4 py-3 rounded-2xl border border-gray-700/50 shadow-xl
        ${isRTL ? 'flex-row-reverse' : ''}
      `}>
                <Input
                    dir={isRTL ? 'rtl' : 'ltr'}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder={isRTL ? "اكتب رسالة دانمو..." : "Send danmu message..."}
                    disabled={isSending}
                    className={`
            bg-transparent border-none text-white placeholder:text-gray-400 
            focus-visible:ring-0 focus-visible:ring-offset-0
            ${isRTL ? 'text-right' : 'text-left'}
          `}
                />
                <Button
                    onClick={sendMessage}
                    disabled={isSending || !text.trim()}
                    className={`
            bg-gradient-to-r from-indigo-600 to-purple-600 
            hover:from-indigo-700 hover:to-purple-700 
            text-white font-medium px-6 py-2 rounded-lg 
            transition-all duration-200 shadow-md hover:shadow-lg
            ${isSending ? 'opacity-70 cursor-wait' : ''}
          `}
                >
                    {isSending ? 'Sending...' : isRTL ? 'إرسال' : 'Send'}
                </Button>
            </div>
        </div>
    );
}