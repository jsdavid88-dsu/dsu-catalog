'use client';

export default function AccessDeniedPage() {
    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-neutral-800 border border-red-900/50 rounded-lg p-8 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-500"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-white">Access Denied</h1>

                <p className="text-gray-400 text-sm leading-relaxed">
                    You do not have permission to access the admin panel.
                </p>

                <p className="text-gray-500 text-xs">
                    If you believe this is an error, please contact an administrator.
                </p>

                <div className="pt-4">
                    <a
                        href="/ko"
                        className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded transition-colors"
                    >
                        Return to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
