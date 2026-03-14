'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Emote {
    id: number;
    src: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
}

const EMOTE_ASSETS = [
    { id: 'smile', icon: '😊' },
    { id: 'heart', icon: '❤️' },
    { id: 'fire', icon: '🔥' },
    { id: 'clap', icon: '👏' },
    { id: 'party', icon: '🎉' },
    { id: 'laugh', icon: '😂' },
    { id: 'wow', icon: '😮' },
    { id: 'cool', icon: '😎' },
];

export function EmotePicker({ onSelect }: { onSelect: (icon: string) => void }) {
    return (
        <div className="flex flex-wrap gap-2 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
            {EMOTE_ASSETS.map((asset) => (
                <button
                    key={asset.id}
                    onClick={() => onSelect(asset.icon)}
                    className="w-10 h-10 flex items-center justify-center text-xl hover:bg-white/10 rounded-lg transition-transform hover:scale-125 active:scale-90"
                >
                    {asset.icon}
                </button>
            ))}
        </div>
    );
}

export default function EmoteSystem({ triggerEmoteIcon }: { triggerEmoteIcon: string | null }) {
    const [emotes, setEmotes] = useState<Emote[]>([]);

    const spawnEmote = useCallback((icon: string) => {
        const newEmote: Emote = {
            id: Date.now() + Math.random(),
            src: icon,
            x: 20 + Math.random() * 60, // 20% to 80% range
            y: 20 + Math.random() * 60,
            rotation: (Math.random() - 0.5) * 60, // -30deg to 30deg
            scale: 0.5 + Math.random() * 1.5,
        };
        setEmotes((prev) => [...prev, newEmote]);

        // Cleanup after animation
        setTimeout(() => {
            setEmotes((prev) => prev.filter((e) => e.id !== newEmote.id));
        }, 2000);
    }, []);

    useEffect(() => {
        if (triggerEmoteIcon) {
            // Spawn multiple for a "pop" effect
            const count = 3 + Math.floor(Math.random() * 5);
            for (let i = 0; i < count; i++) {
                setTimeout(() => spawnEmote(triggerEmoteIcon), i * 100);
            }
        }
    }, [triggerEmoteIcon, spawnEmote]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {emotes.map((emote) => (
                <div
                    key={emote.id}
                    className="absolute text-5xl animate-out fade-out zoom-out-50 duration-[2000ms] pointer-events-none"
                    style={{
                        left: `${emote.x}%`,
                        top: `${emote.y}%`,
                        transform: `translate(-50%, -50%) rotate(${emote.rotation}deg) scale(${emote.scale})`,
                        transition: 'all 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    {emote.src}
                </div>
            ))}
        </div>
    );
}

export { EMOTE_ASSETS };
