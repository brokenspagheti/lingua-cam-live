// src/app/live/page.tsx
'use client';

import { useEffect, useState } from 'react';
import CameraFeed from '@/components/CameraFeed';
import DanmuOverlay from '@/components/DanmuOverlay';
import CaptionBar from '@/components/CaptionBar';
import useYouTubeChat from '@/hooks/useYouTubeChat';
import { useLive } from '@/hooks/useLive';
import QuickChat from '@/components/QuickChat';
import EffectsPicker from '@/components/EffectsPicker';
import Soundboard from '@/components/Soundboard';

import { Globe, Zap, Video, Layers, Mic, MicOff, Youtube, Layout, Smile, Settings, Clock, Timer as TimerIcon, TrendingUp, Link as LinkIcon, Share2, Maximize, ScreenShare } from 'lucide-react';
import WidgetSystem from '@/components/WidgetSystem';
import EmoteSystem, { EmotePicker } from '@/components/EmoteSystem';
import LinkPreview from '@/components/LinkPreview';

// Simple toast function
const showToast = (msg: string) => {
    alert(msg);
};

// Feature Card Component
function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all duration-500 group flex flex-col items-center text-center">
            <div className={`w-10 h-10 ${color} rounded-2xl flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2 leading-tight">{title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
        </div>
    );
}

export default function LivePage() {
    const [viewerLang] = useState(typeof window !== 'undefined' ? (navigator.language || 'en') : 'en');
    const [ytLiveChatId, setYtLiveChatId] = useState('');
    const [isYtConnected, setIsYtConnected] = useState(false);
    const [currentEffect, setCurrentEffect] = useState('none');
    const [isYtPanelOpen, setIsYtPanelOpen] = useState(false);
    const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
    const [triggerEmote, setTriggerEmote] = useState<string | null>(null);
    const [isWidgetMenuOpen, setIsWidgetMenuOpen] = useState(false);
    
    // New Feature States
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [ytApiKey, setYtApiKey] = useState('');
    const [lingoApiKey, setLingoApiKey] = useState('');
    const [isLinkPanelOpen, setIsLinkPanelOpen] = useState(false);
    const [pushedLink, setPushedLink] = useState('');
    const [activeLink, setActiveLink] = useState<string | null>(null);

    // Load keys on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setYtApiKey(localStorage.getItem('ytApiKey') || '');
            setLingoApiKey(localStorage.getItem('lingoApiKey') || '');
        }
    }, []);

    const saveSettings = () => {
        localStorage.setItem('ytApiKey', ytApiKey);
        localStorage.setItem('lingoApiKey', lingoApiKey);
        setIsSettingsOpen(false);
        showToast('Settings saved!');
    };
    
    // Use our unified hook for camera and speech-to-text
    const { stream, cameraError, isRecording, toggleRecording } = useLive();

    useEffect(() => {
        if (stream) {
            const video = document.querySelector('video');
            if (video && !video.srcObject) {
                video.srcObject = stream;
            }
        }
    }, [stream]);

    // RTL detection
    const isRTL = ['ar', 'he', 'ur'].some(lang => viewerLang.startsWith(lang));

    // Removed server-side emitting of viewLang since we use local translation
    useEffect(() => {
        // We handle translation locally via lingo-client now, no socket event needed
    }, [viewerLang]);

    // YouTube chat polling hook – only active when ID is connected
    useYouTubeChat({
        liveChatId: isYtConnected ? ytLiveChatId : '',
        apiKey: ytApiKey, // added API key
    });

    // Helper to extract video ID from YouTube URL
    const extractVideoId = (input: string) => {
        if (!input.includes('youtube.com') && !input.includes('youtu.be')) return input;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = input.match(regExp);
        return (match && match[2].length === 11) ? match[2] : input;
    };

    // Connect YT chat button handler
    const connectYtChat = () => {
        const videoId = extractVideoId(ytLiveChatId);
        if (!videoId.trim() || videoId.includes('youtube.com')) {
            showToast('Please enter a valid YouTube video ID or URL');
            return;
        }
        setYtLiveChatId(videoId);
        setIsYtConnected(true);
        setIsYtPanelOpen(false);
        showToast(`Connected to YouTube: ${videoId.slice(0, 8)}...`);
    };

    const toggleWidget = (id: string) => {
        setActiveWidgets(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
    };

    const handleEmoteSelect = (icon: string) => {
        setTriggerEmote(icon);
        setTimeout(() => setTriggerEmote(null), 100);
    };

    // Broadcast mode removed

    const pushLink = () => {
        if (!pushedLink.trim()) return;
        setActiveLink(pushedLink);
        setIsLinkPanelOpen(false);
        showToast('Link pushed to stream overlay!');
    };

    return (
        <div className={`relative w-full min-h-screen bg-[#050505] overflow-y-auto overflow-x-hidden pt-8 pb-12 transition-all duration-700`}>
            {/* Elegant Background Gradient */}
            <div className={`fixed inset-0 bg-gradient-to-br from-indigo-950/20 via-black to-purple-950/20 pointer-events-none opacity-100`} />
            
            <div className={`relative w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col items-center`}>
                {/* Brand Header */}
                    <div className="w-full flex flex-col items-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Video className="text-white w-7 h-7" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
                                LINGUACAM<span className="text-indigo-500">LIVE</span>
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-gray-400 font-medium text-center max-w-3xl leading-relaxed">
                            Professional <span className="text-white">OBS Overlay Suite</span>: AI-Translated Global Captions, <span className="text-indigo-400">Unified Dynamic Chat</span>, and Interactive Stream Widgets.
                        </p>
                    </div>

                {/* Main Stream Container */}
                <div className={`relative w-full aspect-video bg-black overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)] transition-all duration-700 rounded-[2.5rem]`}>
                    <CameraFeed effect={currentEffect} />
                    <DanmuOverlay viewerLang={viewerLang} />
                    <CaptionBar viewerLang={viewerLang} />
                    
                    {/* Integrated Overlays */}
                    <WidgetSystem activeWidgets={activeWidgets} removeWidget={toggleWidget} />
                    <EmoteSystem triggerEmoteIcon={triggerEmote} />
                    
                    {/* Link Preview Overlay */}
                    {activeLink && (
                        <LinkPreview 
                            url={activeLink} 
                            onClose={() => setActiveLink(null)} 
                        />
                    )}

                </div>

                {/* Control Center - Below Video */}
                    <div className="w-full max-w-7xl mt-12 mb-16 flex flex-wrap items-center justify-center gap-4 px-8 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem]">
                        {/* Recording Toggle */}
                        <button
                            onClick={toggleRecording}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 border backdrop-blur-xl shadow-lg group ${
                                isRecording 
                                ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            <div className={`p-2 rounded-xl transition-colors ${isRecording ? 'bg-red-500/20' : 'bg-white/5'}`}>
                                {isRecording ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
                            </div>
                            <span className="font-semibold tracking-wide">
                                {isRecording ? 'Stop Recording' : 'Start Recording'}
                            </span>
                        </button>

                        <div className="w-px h-8 bg-white/10 mx-2 hidden lg:block" />

                        <EffectsPicker 
                            currentEffect={currentEffect} 
                            onEffectChange={setCurrentEffect} 
                        />
                        <div className="w-px h-8 bg-white/10 mx-2 hidden lg:block" />
                        
                        <QuickChat />
                        <div className="w-px h-8 bg-white/10 mx-2 hidden lg:block" />
                        
                        <Soundboard />
                        
                        <div className="w-px h-8 bg-white/10 mx-2 hidden lg:block" />

                        {/* Link Push Button */}
                        <button
                            onClick={() => setIsLinkPanelOpen(!isLinkPanelOpen)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 border backdrop-blur-xl shadow-lg group ${
                                isLinkPanelOpen 
                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' 
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            <LinkIcon className="w-5 h-5" />
                            <span className="font-semibold">Push Link</span>
                        </button>

                        {/* Settings Panel Toggle */}
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 border backdrop-blur-xl shadow-lg group ${
                                isSettingsOpen || (ytApiKey && lingoApiKey)
                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' 
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-semibold">Setup APIs</span>
                        </button>

                        <div className="w-px h-8 bg-white/10 mx-2 hidden lg:block" />

                        {/* YT Connection Button */}
                        <button
                            onClick={() => setIsYtPanelOpen(!isYtPanelOpen)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 border backdrop-blur-xl shadow-lg group ${
                                isYtConnected 
                                ? 'bg-red-600/20 border-red-500/50 text-red-400' 
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            <Youtube className={`w-5 h-5 ${isYtConnected ? 'text-red-400' : ''}`} />
                            <span className="font-semibold">{isYtConnected ? 'YT Linked' : 'Link YT'}</span>
                        </button>

                        {/* Widget Menu Button */}
                        <button
                            onClick={() => setIsWidgetMenuOpen(!isWidgetMenuOpen)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 border backdrop-blur-xl shadow-lg group ${
                                isWidgetMenuOpen 
                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' 
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            <Layout className="w-5 h-5" />
                            <span className="font-semibold">Widgets</span>
                        </button>
                    </div>

                {/* Sub-panels */}
                    <div className="relative w-full flex flex-col items-center gap-6">
                        {/* Link Push Panel */}
                        {isLinkPanelOpen && (
                            <div className="absolute top-0 z-50 flex flex-col sm:flex-row gap-3 items-center bg-black/80 backdrop-blur-2xl px-6 py-5 rounded-3xl border border-white/10 shadow-2xl max-w-lg w-full animate-in slide-in-from-bottom-4 duration-300">
                                <input
                                    type="text"
                                    placeholder="Paste article or social link..."
                                    value={pushedLink}
                                    onChange={(e) => setPushedLink(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 w-full transition-colors"
                                />
                                <button
                                    onClick={pushLink}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold whitespace-nowrap active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Push to Overlay
                                </button>
                            </div>
                        )}

                        {/* YT Config Panel */}
                        {isYtPanelOpen && (
                            <div className="absolute top-0 z-50 flex flex-col sm:flex-row gap-3 items-center bg-black/80 backdrop-blur-2xl px-6 py-5 rounded-3xl border border-white/10 shadow-2xl max-w-lg w-full animate-in slide-in-from-bottom-4 duration-300">
                                <input
                                    type="text"
                                    placeholder="YouTube Live URL or ID..."
                                    value={ytLiveChatId}
                                    onChange={(e) => setYtLiveChatId(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 w-full transition-colors"
                                />
                                <button
                                    onClick={connectYtChat}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold whitespace-nowrap active:scale-95 transition-all shadow-lg shadow-red-500/20"
                                >
                                    {isYtConnected ? 'Reconnect' : 'Link'}
                                </button>
                            </div>
                        )}

                        {/* Settings / API Key Panel */}
                        {isSettingsOpen && (
                            <div className="absolute top-0 z-50 flex flex-col gap-4 items-center bg-black/80 backdrop-blur-2xl px-8 py-6 rounded-3xl border border-white/10 shadow-2xl max-w-lg w-full animate-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold self-start mb-2">API Configuration</h3>
                                <input
                                    type="text"
                                    placeholder="YouTube API Key..."
                                    value={ytApiKey}
                                    onChange={(e) => setYtApiKey(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 w-full transition-colors"
                                />
                                <input
                                    type="text"
                                    placeholder="Lingo API Key..."
                                    value={lingoApiKey}
                                    onChange={(e) => setLingoApiKey(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 w-full transition-colors"
                                />
                                <button
                                    onClick={saveSettings}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold whitespace-nowrap active:scale-95 transition-all shadow-lg shadow-indigo-500/20 w-full mt-2"
                                >
                                    Save Keys
                                </button>
                            </div>
                        )}

                        {/* Widget Menu */}
                        {isWidgetMenuOpen && (
                            <div className="absolute top-0 z-50 flex gap-4 bg-black/80 backdrop-blur-2xl px-6 py-5 rounded-3xl border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                                <button 
                                    onClick={() => toggleWidget('clock')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${activeWidgets.includes('clock') ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-white/5 text-gray-400'}`}
                                >
                                    <Clock className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase">Clock</span>
                                </button>
                                <button 
                                    onClick={() => toggleWidget('timer')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${activeWidgets.includes('timer') ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-white/5 text-gray-400'}`}
                                >
                                    <TimerIcon className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase">Timer</span>
                                </button>
                                <button 
                                    onClick={() => toggleWidget('stock')}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${activeWidgets.includes('stock') ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-gray-400'}`}
                                >
                                    <TrendingUp className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase">Stocks</span>
                                </button>
                            </div>
                        )}

                        {/* Emote Picker Section */}
                        <div className="flex flex-col items-center mb-12">
                            <div className="flex items-center gap-3 mb-4 text-gray-400">
                                <Smile className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Sticker Reaction Pop</span>
                            </div>
                            <EmotePicker onSelect={handleEmoteSelect} />
                        </div>
                    </div>

                {/* Feature Showcase Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-20">
                    <FeatureCard 
                        icon={<Globe className="text-indigo-400 w-5 h-5" />}
                        color="bg-indigo-500/20"
                        title="Multilingual"
                        desc="Speech-to-English translation via Lingo.dev."
                    />
                    <FeatureCard 
                        icon={<Layers className="text-purple-400 w-5 h-5" />}
                        color="bg-purple-500/20"
                        title="Collision-Free"
                        desc="8-lane vertical positioning system."
                    />
                    <FeatureCard 
                        icon={<Zap className="text-amber-400 w-5 h-5" />}
                        color="bg-amber-500/20"
                        title="Voice Sounds"
                        desc="Trigger SFX with custom voice commands."
                    />
                    <FeatureCard 
                        icon={<Video className="text-pink-400 w-5 h-5" />}
                        color="bg-pink-500/20"
                        title="Cinematic FX"
                        desc="20+ real-time professional filters."
                    />
                    <FeatureCard 
                        icon={<Layers className="text-green-400 w-5 h-5" />}
                        color="bg-green-500/20"
                        title="Live Pipeline"
                        desc="Sub-100ms ultra-low latency."
                    />
                    <FeatureCard 
                        icon={<Globe className="text-blue-400 w-5 h-5" />}
                        color="bg-blue-500/20"
                        title="YouTube Sync"
                        desc="Poll live chat into wave danmu."
                    />
                    <FeatureCard 
                        icon={<Zap className="text-yellow-400 w-5 h-5" />}
                        color="bg-yellow-500/20"
                        title="Quick Chat"
                        desc="One-tap engagement for audience."
                    />
                    <FeatureCard 
                        icon={<Layers className="text-emerald-400 w-5 h-5" />}
                        color="bg-emerald-500/20"
                        title="Wave Danmu"
                        desc="Fluid, sinus-based chat movement."
                    />
                    <FeatureCard 
                        icon={<Video className="text-orange-400 w-5 h-5" />}
                        color="bg-orange-500/20"
                        title="Smart Focus"
                        desc="Automatic pan-zoom framing."
                    />
                    <FeatureCard 
                        icon={<Globe className="text-cyan-400 w-5 h-5" />}
                        color="bg-cyan-500/20"
                        title="Open Source"
                        desc="Hackathon-ready extensible core."
                    />
                </div>
            </div>

            {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-[100] p-6 backdrop-blur-sm">
                    <div className="bg-red-950/30 border border-red-500/20 p-8 rounded-[2.5rem] text-white text-center max-w-md shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 tracking-tight">Camera Access Error</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">{cameraError}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-white text-black hover:bg-gray-200 px-8 py-3.5 rounded-xl font-semibold transition-all active:scale-95"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {isRTL && (
                <div className="absolute bottom-8 right-8 z-50 bg-indigo-600/20 backdrop-blur-md px-4 py-2 rounded-xl text-indigo-300 text-xs font-semibold border border-indigo-500/20 uppercase tracking-widest">
                    RTL Active
                </div>
            )}
        </div>
    );
}
