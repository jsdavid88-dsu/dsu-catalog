'use client';

export default function PendingApprovalPage() {
    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-neutral-800 border border-neutral-700 rounded-lg p-8 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-yellow-900/30 rounded-full flex items-center justify-center">
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
                        className="text-yellow-500"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-white">Awaiting Approval</h1>

                <p className="text-gray-400 text-sm leading-relaxed">
                    Your account has been created successfully, but you need administrator approval to access the admin panel.
                </p>

                <p className="text-gray-500 text-xs">
                    Please contact an administrator to approve your account.
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
