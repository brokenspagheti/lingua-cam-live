"use client";

import { useEffect, useRef } from "react";
import { eventBus } from "@/lib/eventBus";

export interface UseYouTubeChatOptions {
    liveChatId: string;
    apiKey: string;
}

export default function useYouTubeChat({ liveChatId, apiKey }: UseYouTubeChatOptions) {
    const nextPageTokenRef = useRef<string | null>(null);

    useEffect(() => {
        if (!liveChatId || !apiKey) return;

        console.log(`[YouTubeChat] Starting local polling for stream: ${liveChatId}`);
        
        let intervalId: NodeJS.Timeout;
        let isFetching = false;

        const pollChat = async () => {
            if (isFetching) return;
            isFetching = true;

            try {
                // Determine the correct API endpoint.
                // If liveChatId is actually a videoId, we would first need to fetch snippets to get the activeLiveChatId.
                // For simplicity, let's assume `liveChatId` is the actual video ID, and we fetch the liveChatId first.
                // If it's a known liveChatId, we can skip this. Let's fetch the video details.
                
                let activeChatId = liveChatId;

                // Simple check: video IDs are usually 11 chars. Let's just try to get the chat messages directly.
                // Wait, YouTube API requires the exact activeLiveChatId, not the videoId.
                // First, get the live streaming details for the video:
                if (!activeChatId.startsWith("Cg")) {
                    const videoRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${liveChatId}&key=${apiKey}`);
                    const videoData = await videoRes.json();
                    
                    if (videoData.items && videoData.items.length > 0) {
                        activeChatId = videoData.items[0].liveStreamingDetails?.activeLiveChatId;
                    }

                    if (!activeChatId) {
                        console.error("[YouTubeChat] Could not find active live chat for this video.");
                        isFetching = false;
                        return;
                    }
                }

                // Now poll the messages
                let url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${activeChatId}&part=snippet,authorDetails&key=${apiKey}`;
                if (nextPageTokenRef.current) {
                    url += `&pageToken=${nextPageTokenRef.current}`;
                }

                const res = await fetch(url);
                const data = await res.json();

                if (data.items) {
                    for (const item of data.items) {
                        const msg = item.snippet.displayMessage;
                        if (msg) {
                            eventBus.emit("danmu", msg);
                        }
                    }
                }

                if (data.nextPageToken) {
                    nextPageTokenRef.current = data.nextPageToken;
                }
                
                const pollingIntervalMillis = data.pollingIntervalMillis || 3000;
                
                // Adjust interval based on API response
                clearInterval(intervalId);
                intervalId = setInterval(pollChat, pollingIntervalMillis);

            } catch (error) {
                console.error("[YouTubeChat] Polling error:", error);
            } finally {
                isFetching = false;
            }
        };

        // Start initial poll
        intervalId = setInterval(pollChat, 3000);
        pollChat();

        return () => {
             console.log(`[YouTubeChat] Cleaning up local polling for: ${liveChatId}`);
             clearInterval(intervalId);
        };
    }, [liveChatId, apiKey]);
}
