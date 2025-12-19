'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import ProjectForm from '@/components/admin/ProjectForm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MOCK_DATA } from '@/data/projects_v2';
import { Project } from '@/types/project';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';

export default function EditProjectPage() {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const loadProject = async () => {
            if (!id) return;
            console.log("Edit Project Page: loading ID =", id);

            const isMock = localStorage.getItem('mockUser');
            if (isMock) {
                const localProjects: Project[] = JSON.parse(localStorage.getItem('mockProjects') || '[]');
                const found = [...localProjects, ...MOCK_DATA].find(p => p.id === id);
                console.log("Edit Project Page: found in mock =", found ? "YES" : "NO");
                setProject(found || null);
            } else {
                try {
                    const docRef = doc(db, "projects", id as string);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        console.log("Edit Project Page: found in Firestore");
                        setProject({ id: docSnap.id, ...docSnap.data() } as Project);
                    } else {
                        console.log("Edit Project Page: not in Firestore, checking MOCK_DATA");
                        const found = MOCK_DATA.find(p => p.id === id);
                        setProject(found || null);
                    }
                } catch (e) {
                    console.error("Error loading project", e);
                    const found = MOCK_DATA.find(p => p.id === id);
                    setProject(found || null);
                }
            }
            setLoading(false);
        };
        loadProject();
    }, [id]);

    if (!mounted) return null;

    return (
        <AdminLayout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Edit Project</h1>
                    <p className="text-gray-400">ID: {id}</p>
                </div>
                <Link href="/admin" className="text-blue-400 hover:underline mb-1">
                    &larr; Back to Dashboard
                </Link>
            </div>

            {loading ? (
                <p>Loading project data...</p>
            ) : project ? (
                <ProjectForm initialData={project} />
            ) : (
                <div className="p-8 bg-neutral-800 rounded border border-neutral-700 text-center">
                    <p className="text-red-400 font-bold mb-4">Project Not Found</p>
                    <button
                        onClick={() => window.history.back()}
                        className="text-blue-400 hover:underline"
                    >
                        Go Back
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}
