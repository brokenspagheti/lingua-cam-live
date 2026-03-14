'use client';

import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Timer, X, Search } from 'lucide-react';

interface WidgetProps {
    onClose: () => void;
}

function ClockWidget({ onClose }: WidgetProps) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-black/60 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Clock className="text-indigo-400 w-5 h-5" />
            </div>
            <div>
                <div className="text-2xl font-mono font-bold text-white leading-none">
                    {time.toLocaleTimeString([], { hour12: false })}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">
                    System Time
                </div>
            </div>
            <button onClick={onClose} className="ml-2 text-white/20 hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

function StockWidget({ onClose }: WidgetProps) {
    const [symbol, setSymbol] = useState('');
    const [data, setData] = useState<{ price: string; change: string } | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const searchStock = () => {
        if (!symbol) return;
        setIsSearching(true);
        // Mocking stock data for now
        setTimeout(() => {
            const price = (Math.random() * 1000 + 100).toFixed(2);
            const change = (Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1)).toFixed(2);
            setData({ price, change });
            setIsSearching(false);
        }, 800);
    };

    return (
        <div className="bg-black/60 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex flex-col gap-3 min-w-[200px] animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="text-emerald-400 w-4 h-4" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Tracker</span>
                </div>
                <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                </button>
            </div>

            {!data ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="TSLA, BTC..."
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && searchStock()}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 w-full"
                    />
                    <button 
                        onClick={searchStock}
                        disabled={isSearching}
                        className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg hover:bg-emerald-500/30 transition-colors"
                    >
                        <Search className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            ) : (
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <div className="text-xs font-bold text-white/50">{symbol}</div>
                        <div className="text-xl font-mono font-bold text-white">${data.price}</div>
                    </div>
                    <div className={`text-xs font-bold px-2 py-0.5 rounded-md ${parseFloat(data.change) >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {parseFloat(data.change) >= 0 ? '+' : ''}{data.change}%
                    </div>
                    <button onClick={() => setData(null)} className="text-[10px] text-gray-500 hover:text-white underline">Change</button>
                </div>
            )}
        </div>
    );
}

function TimerWidget({ onClose }: WidgetProps) {
    const [seconds, setSeconds] = useState(600);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: any = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => setSeconds((s) => s - 1), 1000);
        } else if (seconds === 0) {
            setIsActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-black/60 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Timer className="text-amber-400 w-5 h-5" />
            </div>
            <div>
                <div 
                    className={`text-2xl font-mono font-bold leading-none cursor-pointer hover:text-amber-400 transition-colors ${isActive ? 'text-white' : 'text-white/50'}`}
                    onClick={() => setIsActive(!isActive)}
                >
                    {formatTime(seconds)}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">
                    {isActive ? 'Live Countdown' : 'Paused - Click to Start'}
                </div>
            </div>
            <button onClick={onClose} className="ml-2 text-white/20 hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

export default function WidgetSystem({ activeWidgets, removeWidget }: { 
    activeWidgets: string[], 
    removeWidget: (id: string) => void 
}) {
    return (
        <div className="absolute top-8 right-8 z-40 flex flex-col gap-4 items-end pointer-events-auto">
            {activeWidgets.includes('clock') && <ClockWidget onClose={() => removeWidget('clock')} />}
            {activeWidgets.includes('stock') && <StockWidget onClose={() => removeWidget('stock')} />}
            {activeWidgets.includes('timer') && <TimerWidget onClose={() => removeWidget('timer')} />}
        </div>
    );
}
