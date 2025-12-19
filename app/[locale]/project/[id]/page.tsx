import { notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Project } from '@/types/project';
import ProjectDetailClient from '@/components/project/ProjectDetailClient';
import { MOCK_DATA } from '@/data/projects_v2';

export async function generateStaticParams() {
    const locales = ['ko', 'en', 'ja', 'zh'];
    const params = [];

    for (const project of MOCK_DATA) {
        for (const locale of locales) {
            params.push({ id: project.id!, locale });
        }
    }

    return params;
}

// Server Component for fetching data
export default async function ProjectDetailPage({
    params
}: {
    params: Promise<{ id: string; locale: string }>
}) {
    const { id, locale } = await params;

    let project: Project | null = null;

    // 1. Try fetching from Firestore
    try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            project = { id: docSnap.id, ...docSnap.data() } as Project;
        }
    } catch (e) {
        console.error("Firebase fetch failed", e);
    }

    // 2. Fallback for Mock Data (since we are using mocks for demo)
    if (!project) {
        const { MOCK_DATA } = await import('@/data/projects_v2');
        project = MOCK_DATA.find(p => p.id === id) || null;
    }

    return (
        <ProjectDetailClient projectId={id} initialProject={project} locale={locale as any} />
    );
}
