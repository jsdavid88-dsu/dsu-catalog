"use client";

import { useState } from 'react';

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash"
];

export default function TestGeminiPage() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState("");

    const runTests = async () => {
        if (!apiKey) {
            alert("Please enter an API Key");
            return;
        }
        setLoading(true);
        setResults([]);

        const newResults = [];

        for (const model of MODELS) {
            try {
                const res = await fetch('/api/test-gemini', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        apiKey,
                        model
                    })
                });
                const data = await res.json();
                newResults.push({
                    model,
                    status: res.ok ? 'SUCCESS' : 'FAILED',
                    message: data.message || data.error || 'Unknown result',
                    translation: data.translation
                });
            } catch (e: any) {
                newResults.push({
                    model,
                    status: 'ERROR',
                    message: e.message
                });
            }
            setResults([...newResults]);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white text-black min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Gemini API Local Test</h1>

            <div className="mb-6 p-4 bg-gray-100 rounded">
                <input
                    type="text"
                    placeholder="Paste your API Key here"
                    className="border p-2 w-full mb-4 rounded"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                    onClick={runTests}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded font-bold"
                >
                    {loading ? 'Testing...' : 'TEST KEY'}
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Model</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Message</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((r, i) => (
                        <tr key={i} className={r.status === 'SUCCESS' ? 'bg-green-50' : 'bg-red-50'}>
                            <td className="border p-2 font-bold">{r.model}</td>
                            <td className="border p-2">{r.status}</td>
                            <td className="border p-2 text-sm">{r.status === 'SUCCESS' ? r.translation : r.message}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
