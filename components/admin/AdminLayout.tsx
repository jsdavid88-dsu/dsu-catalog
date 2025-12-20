'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import PendingApprovalPage from './PendingApprovalPage';
import AccessDeniedPage from './AccessDeniedPage';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, userRole } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            window.location.href = '/admin/login';
        }
    }, [user, loading]);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('mockUser');
            localStorage.removeItem('mockProjects');
            await signOut(auth);
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading Admin...</div>;
    }

    if (!user) {
        return null;
    }

    // Check user role
    if (userRole === 'pending') {
        return <PendingApprovalPage />;
    }

    if (userRole !== 'admin' && userRole !== 'student') {
        return <AccessDeniedPage />;
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white">
            {/* Top Header Bar */}
            <div className="bg-neutral-800 border-b border-neutral-700 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold tracking-widest uppercase text-gray-300">Admin Dashboard</h1>
                    {userRole && (
                        <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${userRole === 'admin' ? 'bg-purple-900/50 text-purple-400' : 'bg-blue-900/50 text-blue-400'
                            }`}>
                            {userRole}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{user.email}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors font-bold"
                    >
                        Logout
                    </button>
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
            </div>

            {/* Main Content */}
            <div className="p-8">
                {children}
            </div>
        </div>
    );
}
