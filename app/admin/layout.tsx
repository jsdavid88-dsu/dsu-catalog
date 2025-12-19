import type { Metadata } from 'next';
import "@/app/globals.css";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
    title: 'DSU Admin',
    description: 'Admin Dashboard',
};

import { NextIntlClientProvider } from 'next-intl';

export default function RootAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className="antialiased bg-black text-white min-h-screen">
                <NextIntlClientProvider locale="en" messages={{}}>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
