import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { text, targetLocales } = await request.json();

        if (!text || !targetLocales) {
            return NextResponse.json(
                { error: 'Missing text or targetLocales' },
                { status: 400 }
            );
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not configured, using mock translation');
            // Fallback to mock
            const translations: Record<string, string> = {};
            (targetLocales as string[]).forEach(lang => {
                translations[lang] = lang === 'ko' ? text : `[Auto-translated] ${text}`;
            });
            return NextResponse.json({ translations });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
        const translations: Record<string, string> = {};

        // Translate to each target language
        for (const locale of targetLocales as string[]) {
            if (locale === 'ko') {
                // Source is Korean, no translation needed
                translations[locale] = text;
                continue;
            }

            const languageNames: Record<string, string> = {
                'en': 'English',
                'ja': 'Japanese',
                'zh': 'Chinese (Simplified)'
            };

            const targetLanguage = languageNames[locale] || locale;

            try {
                const prompt = `Translate the following Korean text to ${targetLanguage}. 
Provide ONLY the translation, no explanations or additional text.
This is for an animation project catalog, so maintain a professional and creative tone.

Korean text:
${text}

${targetLanguage} translation:`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const translation = response.text().trim();

                translations[locale] = translation;

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`Gemini translation error for ${locale}:`, error);
                translations[locale] = `[Translation failed] ${text}`;
            }
        }

        return NextResponse.json({ translations });

    } catch (error) {
        console.error('Translation API error:', error);
        return NextResponse.json(
            { error: 'Translation failed' },
            { status: 500 }
        );
    }
}
