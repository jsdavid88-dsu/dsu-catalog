import FeedBoard from '@/components/home/FeedBoard';

export function generateStaticParams() {
    return [{ locale: 'ko' }, { locale: 'en' }, { locale: 'ja' }, { locale: 'zh' }];
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    // We can pass locale to FeedBoard to render correct language
    return (
        <main className="min-h-screen bg-black">
            <FeedBoard locale={locale as any} />
        </main>
    );
}
