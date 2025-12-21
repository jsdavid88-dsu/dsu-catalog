'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import UserManagement from '@/components/admin/UserManagement';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { MOCK_DATA } from '@/data/projects_v2';
import { Project } from '@/types/project';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'projects' | 'users'>('projects');
    const [projects, setProjects] = useState<Project[]>([]);
    const [mockMode, setMockMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const { user, userRole } = useAuth();

    useEffect(() => {
        setMounted(true);
        const loadData = async () => {
            const isMock = localStorage.getItem('mockUser');
            console.log("Admin Dashboard: isMock =", isMock);

            if (isMock) {
                setMockMode(true);
                const localProjects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
                console.log("Admin Dashboard: localProjects count =", localProjects.length);

                // Use a Map to deduplicate by ID, prioritizing local storage over MOCK_DATA
                const projectMap = new Map<string, Project>();
                MOCK_DATA.forEach(p => projectMap.set(p.id!, p));
                localProjects.forEach((p: Project) => projectMap.set(p.id!, p));

                const combined = Array.from(projectMap.values());
                console.log("Admin Dashboard: combined count =", combined.length);
                setProjects(combined);
            } else {
                try {
                    const snap = await getDocs(collection(db, "projects"));
                    const firestoreProjects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
                    console.log("Admin Dashboard: firestoreProjects count =", firestoreProjects.length);

                    // Merge MOCK_DATA with Firestore, Firestore takes priority
                    const projectMap = new Map<string, Project>();
                    MOCK_DATA.forEach(p => projectMap.set(p.id!, p));
                    firestoreProjects.forEach(p => projectMap.set(p.id!, p));

                    setProjects(Array.from(projectMap.values()));
                } catch (e) {
                    console.error("Failed to fetch projects", e);
                    setProjects(MOCK_DATA);
                }
            }
            setLoading(false);
        };
        loadData();
    }, []);

    const handleClearStorage = () => {
        if (confirm("Clear local mock data? This will reset edits in Test Mode.")) {
            localStorage.removeItem('mockProjects');
            window.location.reload();
        }
    };

    if (!mounted) return null;

    // Filter projects based on role
    const isAdmin = userRole === 'admin';
    const displayedProjects = isAdmin
        ? projects
        : projects.filter(p => p.createdBy === user?.uid);

    return (
        <AdminLayout>
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 border-b border-neutral-700">
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-6 py-3 font-bold transition-colors ${activeTab === 'projects'
                        ? 'border-b-2 border-blue-500 text-white'
                        : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    Projects
                </button>
                {isAdmin && (
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 font-bold transition-colors ${activeTab === 'users'
                            ? 'border-b-2 border-purple-500 text-white'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        User Management
                    </button>
                )}
            </div>

            {/* Projects Tab */}
            {activeTab === 'projects' && (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {isAdmin ? 'Admin Dashboard' : 'My Project'}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {isAdmin
                                    ? `Managing ${displayedProjects.length} projects`
                                    : displayedProjects.length > 0
                                        ? 'Your graduation project'
                                        : 'No project yet - create one to get started'}
                            </p>
                        </div>
                        {isAdmin && (
                            <Link href="/admin/projects/new" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
                                + Add New Project
                            </Link>
                        )}
                        {!isAdmin && displayedProjects.length === 0 && (<Link href="/admin/projects/new" className="px-4 py-2 bg-green-600 rounded hover:bg-green-500">
                            + Create My Project
                        </Link>
                        )}
                    </div>

                    <div className="bg-neutral-800 p-6 rounded-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">System Status</h2>
                        {mockMode && (
                            <div className="mb-6 p-4 bg-blue-900/40 border border-blue-500/40 rounded text-blue-200">
                                <span className="font-bold">TEST MODE ACTIVE</span>: Changes are saved to local storage.
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-6 bg-neutral-700/50 rounded border border-neutral-600 flex flex-col justify-between h-32">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Projects</h3>
                                <p className="text-4xl font-bold text-white">{projects.length}</p>
                            </div>
                            <div className="p-6 bg-neutral-700/50 rounded border border-neutral-600 flex flex-col justify-between h-32">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Views</h3>
                                <p className="text-4xl font-bold text-blue-400">
                                    {projects.reduce((acc, p) => acc + (p.views || 0), 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-6 bg-neutral-700/50 rounded border border-neutral-600 flex flex-col justify-between h-32 md:col-span-2">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Top Project</h3>
                                {projects.length > 0 ? (
                                    <div className="flex justify-between items-end">
                                        <div className="truncate pr-4">
                                            <p className="text-lg font-bold text-white truncate max-w-[200px]">
                                                {[...projects].sort((a, b) => (b.views || 0) - (a.views || 0))[0]?.title.ko}
                                            </p>
                                            <p className="text-xs text-gray-500">Highest engagement</p>
                                        </div>
                                        <p className="text-2xl font-black text-purple-400">
                                            {[...projects].sort((a, b) => (b.views || 0) - (a.views || 0))[0]?.views || 0}
                                        </p>
                                    </div>
                                ) : <p className="text-gray-500">N/A</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">Manage Projects</h2>
                        {loading ? (
                            <p>Loading projects...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-neutral-700 text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                            <th className="py-3 px-4">Title (KO)</th>
                                            <th className="py-3 px-4">Year</th>
                                            <th className="py-3 px-4">Views</th>
                                            <th className="py-3 px-4">YouTube ID</th>
                                            <th className="py-3 px-4">Created by</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedProjects.map((proj) => (
                                            <tr key={proj.id} className="border-b border-neutral-700/50 hover:bg-neutral-700/30 transition-colors">
                                                <td className="py-3 px-4 font-medium">{proj.title.ko}</td>
                                                <td className="py-3 px-4 text-gray-400">{proj.year}</td>
                                                <td className="py-3 px-4">
                                                    <span className="font-mono text-sm text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                                                        {proj.views || 0}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-500 text-xs font-mono">
                                                    {proj.youtubeId || proj.fullYoutubeId || '-'}
                                                </td>
                                                <td className="py-3 px-4 text-gray-500 text-sm">
                                                    {proj.createdByEmail || 'Unknown'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${proj.status === 'published' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                                                        }`}>
                                                        {proj.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    {(userRole === 'admin' || proj.createdBy === user?.uid) && (
                                                        <>
                                                            <Link
                                                                href={`/admin/projects/${proj.id}`}
                                                                className="text-blue-400 hover:text-blue-300 font-medium mr-4"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button className="text-red-400 hover:text-red-300 font-medium">
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                    {userRole !== 'admin' && proj.createdBy !== user?.uid && (
                                                        <span className="text-gray-600 text-sm">No access</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )
            }

            {/* Users Tab (Admin Only) */}
            {
                activeTab === 'users' && isAdmin && (
                    <UserManagement />
                )
            }
        </AdminLayout >
    );
}
