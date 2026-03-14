'use client';

import React, { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';

const EFFECTS = [
    { id: 'none', name: 'None' },
    { id: 'noir', name: 'Noir' },
    { id: 'sepia', name: 'Sepia' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'dreamy', name: 'Dreamy' },
    { id: 'cyberpunk', name: 'Cyber' },
    { id: 'cold', name: 'Cold' },
    { id: 'warm', name: 'Warm' },
    { id: 'dramatic', name: 'Drama' },
    { id: 'faded', name: 'Faded' },
    { id: 'nightvision', name: 'Night' },
    { id: 'posterize', name: 'Poster' },
    { id: 'invert', name: 'Invert' },
    { id: 'gold', name: 'Gold' },
    { id: 'ocean', name: 'Ocean' },
    { id: 'forest', name: 'Forest' },
    { id: 'glitch', name: 'Glitch' },
    { id: 'blueprint', name: 'Blue' },
    { id: 'infrared', name: 'Heat' },
    { id: 'bloom', name: 'Bloom' },
    { id: 'retro-game', name: 'Retro' },
    { id: 'pencil', name: 'Sketch' },
    { id: 'comic', name: 'Comic' },
    { id: 'high-key', name: 'High' },
    { id: 'low-key', name: 'Low' },
];

interface EffectsPickerProps {
    currentEffect: string;
    onEffectChange: (id: string) => void;
}

export default function EffectsPicker({ currentEffect, onEffectChange }: EffectsPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 border backdrop-blur-xl shadow-lg group ${
                    isOpen 
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                }`}
            >
                <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-purple-500/20' : 'bg-white/5'}`}>
                    <Sparkles className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-90 scale-110' : 'group-hover:rotate-12'}`} />
                </div>
                <span className="font-semibold tracking-wide">Effects</span>
            </button>

            {/* Picker Menu */}
            {isOpen && (
                <div className="absolute bottom-full left-0 mb-6 w-80 max-h-[480px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <h3 className="text-white font-bold flex items-center gap-2">
                             Cinematic Filters
                        </h3>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-xl text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-2 overflow-y-auto max-h-[360px] custom-scrollbar">
                        {EFFECTS.map((effect) => (
                            <button
                                key={effect.id}
                                onClick={() => {
                                    onEffectChange(effect.id);
                                    // setIsOpen(false); // Keep open to allow rapid switching
                                }}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 group ${
                                    currentEffect === effect.id
                                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                                    : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10 hover:text-white hover:border-white/10'
                                }`}
                            >
                                <span className="text-sm font-medium">{effect.name}</span>
                                {currentEffect === effect.id && <Check className="w-3 h-3" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
