// src/components/CameraFeed.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface CameraFeedProps {
    effect?: string;
}

export default function CameraFeed({ effect = 'none' }: CameraFeedProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        facingMode: 'user', // front camera by default
                    },
                    audio: true, // needed for transcription
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play().catch(e => console.error('Video play error:', e));
                }

                setIsLoading(false);
            } catch (err: any) {
                console.error('Camera access error:', err);
                setError(
                    err.name === 'NotAllowedError'
                        ? 'Camera/microphone access denied. Please allow permissions in your browser and refresh.'
                        : 'Failed to access camera. Try again or check your device settings.'
                );
                setIsLoading(false);
            }
        };

        startCamera();

        // Cleanup: stop tracks on unmount
        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="relative w-full h-full">
            {/* Video feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover origin-center animate-cinematic-zoom effect-${effect}`}
            />

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-white text-lg">Accessing camera...</p>
                    </div>
                </div>
            )}

            {/* Error overlay */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-30 p-8">
                    <div className="bg-red-900/80 p-8 rounded-2xl text-white text-center max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Camera Error</h2>
                        <p className="mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium transition"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}