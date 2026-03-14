"use client";

import { useState, useEffect, useCallback } from "react";
import { eventBus } from "@/lib/eventBus";

// Define the SpeechRecognition interface (simplified)
interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
}

export function useLive() {
    // State variables
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isCameraLoading, setIsCameraLoading] = useState(true);
    const [captions, setCaptions] = useState<string>("");
    const [recognition, setRecognition] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(true);
    const [isRecording, setIsRecording] = useState(false);

    // Socket Connection replaced by local eventBus
    useEffect(() => {
        setIsConnected(true);
    }, []);

    const broadcastCaption = useCallback((text: string) => {
        eventBus.emit("caption", { text, timestamp: Date.now() });
    }, []);

    // Web Speech API Setup
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition =
                (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (!SpeechRecognition) {
                console.error("Speech recognition is not supported in this browser.");
                setCameraError("Speech recognition is not supported in this browser.");
                return;
            }

            const sr = new SpeechRecognition();
            sr.continuous = true;
            sr.interimResults = true;
            sr.lang = "en-US";

            sr.onresult = (event: any) => {
                let finalTranscript = "";
                let interimTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setCaptions(finalTranscript);
                    broadcastCaption(finalTranscript);
                } else if (interimTranscript) {
                    setCaptions(interimTranscript);
                }
            };

            sr.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                if (event.error === 'no-speech' || event.error === 'network') {
                    // Don't auto-stop if marked as recording
                }
            };

            sr.onend = () => {
                console.log("Speech recognition ended");
                // Only restart if isRecording is true (handled via state trigger)
            };

            setRecognition(sr);
        }
    }, [broadcastCaption]);

    // Handle manual recording toggle
    const toggleRecording = useCallback(() => {
        if (!recognition) return;

        if (isRecording) {
            try {
                recognition.stop();
                setIsRecording(false);
            } catch (e) {
                console.error("Stop failed:", e);
            }
        } else {
            try {
                recognition.start();
                setIsRecording(true);
            } catch (e) {
                console.error("Start failed:", e);
            }
        }
    }, [recognition, isRecording]);

    // Auto-restart logic when should be recording
    useEffect(() => {
        if (isRecording && recognition) {
            const handleEnd = () => {
                if (isRecording) {
                    console.log("Auto-restarting speech recognition...");
                    try { recognition.start(); } catch(e) {}
                }
            };
            recognition.onend = handleEnd;
            return () => { recognition.onend = null; };
        }
    }, [isRecording, recognition]);

    // Request Camera Access
    useEffect(() => {
        let mounted = true;

        const startStream = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (mounted) {
                    setStream(mediaStream);
                    setIsCameraLoading(false);
                }
            } catch (err) {
                console.error("Camera error:", err);
                if (mounted) {
                    setCameraError("Camera access denied – check permissions and refresh");
                    setIsCameraLoading(false);
                }
            }
        };

        if (recognition) {
            startStream();
        }

        return () => {
            mounted = false;
        };
    }, [recognition]);

    return {
        stream,
        cameraError,
        isCameraLoading,
        captions,
        isConnected,
        isRecording,
        toggleRecording
    };
}
