// src/lib/eventBus.ts

export type EventMap = {
    'danmu': string;
    'caption': { text: string; timestamp: number } | string;
    'set-language': string;
};

class EventBus extends EventTarget {
    emit<K extends keyof EventMap>(event: K, detail: EventMap[K]) {
        this.dispatchEvent(new CustomEvent(event, { detail }));
    }

    on<K extends keyof EventMap>(event: K, listener: (detail: EventMap[K]) => void) {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent<EventMap[K]>;
            listener(customEvent.detail);
        };
        this.addEventListener(event, handler);
        return () => this.removeEventListener(event, handler); // Returns cleanup function
    }
}

export const eventBus = new EventBus();
