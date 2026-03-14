'use client';

import React, { useState } from 'react';
import { Volume2, X, Play } from 'lucide-react';

const SOUNDS = [
    { id: 'faah', name: 'Faah!', file: '/faah.mp3' },
    { id: 'airhorn', name: 'Airhorn', file: '/airhorn.mp3' },
    { id: 'wow', name: 'Wow!', file: '/wow.mp3' },
    { id: 'drumroll', name: 'Drumroll', file: '/drumroll.mp3' },
    { id: 'sad', name: 'Sad Trombone', file: '/sad.mp3' },
    { id: 'cash', name: 'Cha-Ching', file: '/cash.mp3' },
];

export default function Soundboard() {
    const [isOpen, setIsOpen] = useState(false);

    const playSound = (file: string) => {
        const audio = new Audio(file);
        audio.play().catch(e => console.error("Soundboard play failed:", e));
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 border backdrop-blur-xl shadow-lg group ${
                    isOpen 
                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                }`}
            >
                <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-green-500/20' : 'bg-white/5'}`}>
                    <Volume2 className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'scale-110' : 'group-hover:rotate-12'}`} />
                </div>
                <span className="font-semibold tracking-wide">Soundboard</span>
            </button>

            {/* Picker Menu */}
            {isOpen && (
                <div className="absolute bottom-full left-0 mb-6 w-[420px] max-h-[520px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <h3 className="text-white font-bold flex items-center gap-2">
                             Stream SFX Picker
                        </h3>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-2 overflow-y-auto max-h-[400px] custom-scrollbar">
                        {SOUNDS.map((sound) => (
                            <button
                                key={sound.id}
                                onClick={() => playSound(sound.file)}
                                className={`flex items-center justify-between px-4 py-4 rounded-xl border border-white/5 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200 group active:scale-95`}
                            >
                                <span className="text-xs font-bold tracking-tight uppercase">{sound.name}</span>
                                <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity fill-current" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
