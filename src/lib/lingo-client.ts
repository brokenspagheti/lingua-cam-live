/**
 * Client-side Lingo.dev helper.
 * Real translation is now handled server-side via Socket.io to avoid browser build errors
 * and protect API keys.
 */
export class LingoClient {
    private static instance: LingoClient;

    private constructor() { }

    public static getInstance(): LingoClient {
        if (!LingoClient.instance) {
            LingoClient.instance = new LingoClient();
        }
        return LingoClient.instance;
    }

    public async translate(
        text: string,
        _options: { targetLocale: string; sourceLocale?: string; instructions?: string },
        apiKey?: string
    ): Promise<{ translatedText: string }> {
        let keyToUse = apiKey;
        if (!keyToUse && typeof window !== 'undefined') {
            keyToUse = localStorage.getItem('lingoApiKey') || '';
        }
        
        if (!keyToUse) {
            return { translatedText: text }; // Fallback
        }

        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    targetLangs: [_options.targetLocale],
                    apiKey: keyToUse
                })
            });

            if (!res.ok) throw new Error('Translation failed');

            const data = await res.json();
            return { translatedText: data.translations[0] || text };
        } catch (err) {
            console.error('Translation error:', err);
            return { translatedText: text };
        }
    }
}

export const translator = LingoClient.getInstance();
