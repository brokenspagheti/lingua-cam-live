// src/components/DanmuOverlay.tsx
'use client';

import { useEffect, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';

interface DanmuOverlayProps {
    viewerLang: string;
}

export default function DanmuOverlay({ viewerLang }: DanmuOverlayProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const laneCount = 8;
    const laneUsage = useRef<number[]>(new Array(laneCount).fill(0));

    useEffect(() => {
        const handleDanmu = (msg: string) => {
            if (!overlayRef.current || !msg?.trim()) return;

            // Find an available lane or the least recently used one
            const now = Date.now();
            let laneIndex = laneUsage.current.findIndex(lastUsed => now - lastUsed > 2000); // 2s gap per lane
            if (laneIndex === -1) {
                // If all lanes are busy, pick the oldest one
                laneIndex = laneUsage.current.indexOf(Math.min(...laneUsage.current));
            }
            laneUsage.current[laneIndex] = now;

            const danmu = document.createElement('div');
            danmu.className = 'danmu-wave absolute whitespace-nowrap pointer-events-none transition-opacity duration-300';
            danmu.textContent = msg;

            // Positioning in the chosen lane
            const laneHeight = 100 / (laneCount + 2); // Avoid top/bottom edges
            const top = (laneIndex + 1) * laneHeight;
            
            const duration = 12 + Math.random() * 2; // subtle variation for natural feel
            const hue = 190 + Math.random() * 30; // restricted cyan range
            const fontSize = 1.6 + Math.random() * 0.4; // consistent large text

            danmu.style.top = `${top}%`;
            danmu.style.fontSize = `${fontSize}rem`;
            danmu.style.color = `hsl(${hue}, 90%, 80%)`;
            danmu.style.setProperty('--amp', `${15 + Math.random() * 15}px`); // reduced amplitude for readability
            danmu.style.animation = `wave-scroll ${duration}s linear forwards`;
            danmu.style.animationDirection = 'normal';

            overlayRef.current.appendChild(danmu);

            // Cleanup
            setTimeout(() => {
                if (danmu.parentNode) danmu.parentNode.removeChild(danmu);
            }, duration * 1000 + 500);
        };

        const unsubscribe = eventBus.on('danmu', handleDanmu);

        return () => {
            unsubscribe();
        };
    }, [viewerLang]);

    return (
        <div
            ref={overlayRef}
            className="absolute inset-0 z-10 overflow-hidden pointer-events-none"
        />
    );
}