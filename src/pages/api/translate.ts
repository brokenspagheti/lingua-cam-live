import { NextApiRequest, NextApiResponse } from 'next';
import { LingoDotDevEngine } from 'lingo.dev/sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { text, targetLangs, apiKey } = req.body;

    if (!text || !targetLangs || !Array.isArray(targetLangs)) {
        return res.status(400).json({ message: 'Missing text or targetLangs' });
    }

    const lingoApiKey = apiKey || process.env.NEXT_PUBLIC_LINGO_API_KEY || process.env.LINGO_API_KEY;

    if (!lingoApiKey) {
        return res.status(401).json({ message: 'Missing Lingo API Key' });
    }

    try {
        const lingoEngine = new LingoDotDevEngine({ apiKey: lingoApiKey });

        const translations = await lingoEngine.batchLocalizeText(text, {
            sourceLocale: 'auto' as any,
            targetLocales: targetLangs as any[]
        });

        return res.status(200).json({ translations });
    } catch (error) {
        console.error('Translation error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
