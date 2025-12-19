'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import DataSeeder from '@/components/admin/DataSeeder';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginAsMock } = useAuth();

    const handleMockLogin = () => {
        if (loginAsMock) {
            loginAsMock();
            // Use window.location to avoid locale routing
            window.location.href = '/admin';
        } else {
            console.error("Mock login not available");
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '/admin';
        } catch (err: any) {
            setError('Failed to login: ' + err.message);
        }
    };

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.location.href = '/admin';
        } catch (err: any) {
            setError('Failed to register: ' + err.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="w-full max-w-md p-8 bg-neutral-900 rounded-lg shadow-xl border border-neutral-800">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

                {/* Mock Login Section - Development Only */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-8 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg text-center">
                        <p className="text-sm text-blue-200 mb-3 font-bold tracking-widest uppercase">Development Mode</p>
                        <button
                            onClick={handleMockLogin}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex flex-col items-center gap-1 transition shadow-lg shadow-blue-900/20"
                        >
                            <span>USE TEST ACCOUNT</span>
                            <span className="text-[10px] font-normal opacity-70 tracking-tight">One-Click Bypass</span>
                        </button>
                    </div>
                )}

                {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

                <form onSubmit={handleLogin} className="opacity-50 hover:opacity-100 transition duration-300">
                    <div className="text-center text-xs text-gray-500 mb-4 uppercase tracking-widest">Or login with Firebase</div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded focus:outline-none focus:border-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded focus:outline-none focus:border-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="w-full py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition mb-4">
                        Login
                    </button>

                    <button type="button" onClick={handleRegister} className="w-full py-3 bg-neutral-700 text-white font-bold rounded hover:bg-neutral-600 transition">
                        Register (First Time)
                    </button>
                </form>

                <DataSeeder />
            </div>
        </div>
    );
}
