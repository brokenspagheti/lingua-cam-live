// src/components/CaptionBar.tsx
'use client';

import { useEffect, useState } from 'react';
import { eventBus } from '@/lib/eventBus';

// Define the props for the CaptionBar component
interface CaptionBarProps {
    viewerLang: string;
}

export default function CaptionBar({ viewerLang }: CaptionBarProps) {
    const [caption, setCaption] = useState<string>('');

    // RTL detection
    const isRTL = ['ar', 'he', 'ur'].some(lang => viewerLang.startsWith(lang));

    useEffect(() => {
        // Listen for 'caption' events from the eventBus
        const unsubscribe = eventBus.on('caption', (rawCaption: any) => {
            const text = typeof rawCaption === 'string' ? rawCaption : rawCaption?.text;
            if (!text?.trim()) return;
            setCaption(text); // Set the caption directly without translation
        });

        // Clean up the eventBus listener on component unmount
        return () => {
            unsubscribe();
        };
    }, [viewerLang]);

    // If there is no caption, return null
    if (!caption) return null;

    // Render the caption bar
    return (
        <div
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`
            absolute bottom-16 left-1/2 -translate-x-1/2 z-30 
            w-auto max-w-[90%] md:max-w-5xl px-8 py-4
            bg-black/60 backdrop-blur-md rounded-xl
            border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]
            text-white text-xl sm:text-2xl md:text-3xl font-medium 
            tracking-wide text-center
            transition-all duration-500 animate-in fade-in slide-in-from-bottom-4
          `}
        >
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {caption}
            </span>
        </div>
    );
}
