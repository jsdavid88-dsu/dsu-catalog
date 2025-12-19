import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Outfit, Syncopate } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import "../globals.css";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const syncopate = Syncopate({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-syncopate' });

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!['en', 'ko', 'ja', 'zh'].includes(locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${outfit.variable} ${syncopate.variable} font-sans antialiased bg-zinc-950 text-white min-h-screen flex flex-col selection:bg-cyan-500/30`}>
                <NextIntlClientProvider messages={messages}>
                    <Navbar />
                    <main className="flex-grow pt-0">
                        {children}
                    </main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
