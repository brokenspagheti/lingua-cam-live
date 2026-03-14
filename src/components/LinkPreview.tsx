'use client';

import React from 'react';
import { ExternalLink, X, QrCode } from 'lucide-react';

interface LinkPreviewProps {
    url: string;
    onClose: () => void;
}

export default function LinkPreview({ url, onClose }: LinkPreviewProps) {
    if (!url) return null;

    // Extract hostname for cleaner display
    const getHostName = (urlStr: string) => {
        try {
            return new URL(urlStr).hostname;
        } catch (e) {
            return urlStr;
        }
    };

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000`;

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl animate-in slide-in-from-bottom-8 duration-500 ease-out">
            <div className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden flex items-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* QR Code Section */}
                <div className="bg-white p-3 flex-shrink-0">
                    <img 
                        src={qrUrl} 
                        alt="QR Code" 
                        className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 px-4 sm:px-6 py-3 flex flex-col justify-center overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">Shared Resource</span>
                    </div>
                    <h4 className="text-white text-sm sm:text-base font-bold truncate leading-relaxed">
                        {getHostName(url)}
                    </h4>
                    <p className="text-gray-400 text-[10px] sm:text-xs truncate font-medium flex items-center gap-1.5">
                        <ExternalLink className="w-3 h-3 text-gray-500" />
                        {url}
                    </p>
                </div>

                {/* Action Section */}
                <div className="flex items-center gap-2 pr-4 pl-2 shrink-0 border-l border-white/10 h-full py-4">
                     <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-[10px] font-bold text-white/40 uppercase">Scan to</span>
                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">Follow Link</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Subtle Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl -z-10 rounded-3xl" />
        </div>
    );
}
