'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            window.location.href = '/admin/login';
        }
    }, [user, loading]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading Admin...</div>;
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white">
            {/* Top Header Bar */}
            <div className="bg-neutral-800 border-b border-neutral-700 px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-widest uppercase text-gray-300">Admin Dashboard</h1>
                <a
                    href="/ko"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg>
                    Back to Home
                </a>
            </div>

            {/* Main Content */}
            <div className="p-8">
                {children}
            </div>
        </div>
    );
}
