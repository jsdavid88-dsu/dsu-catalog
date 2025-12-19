'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { MOCK_DATA } from '@/data/projects_v2';

interface ProjectDetailProps {
    projectId: string;
    initialProject: Project | null;
    locale: 'ko' | 'en' | 'ja' | 'zh';
}

export default function ProjectDetailClient({ projectId, initialProject, locale }: ProjectDetailProps) {
    const [project, setProject] = useState<Project | null>(initialProject);

    useEffect(() => {
        // Hydrate from localStorage if in mock mode
        const isMock = localStorage.getItem('mockUser');
        if (isMock) {
            const localProjects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
            const found = localProjects.find((p: Project) => p.id === projectId);
            if (found) {
                console.log("ProjectDetailClient: Using local storage version of project", projectId);
                setProject(found);
            } else if (!project) {
                // Last ditch effort if initialProject was null for some reason
                const mockMatch = MOCK_DATA.find(p => p.id === projectId);
                if (mockMatch) setProject(mockMatch as Project);
            }
        }
    }, [projectId]);

    if (!project) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-gray-500">
                Project not found.
            </div>
        );
    }

    // Use fullYoutubeId if available, fall back to youtubeId
    const videoId = project.fullYoutubeId || project.youtubeId;

    // Default empty array if no artworks
    const artworks = project.artworkUrls || [];

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-32">

            {/* Nav / Back Button */}
            <div className="fixed top-24 left-6 md:left-12 z-40">
                <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <ArrowLeft size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest hidden md:inline-block">Back to Catalog</span>
                </Link>
            </div>

            {/* HER0 SECTION - Full Width Video */}
            <div className="w-full h-[60vh] md:h-[80vh] bg-black relative">
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                    title={project.title?.[locale] || ''}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            {/* CONTENT SECTION */}
            <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-12 gap-12">

                {/* Left: Title & Synposis (8 cols) */}
                <div className="md:col-span-8 flex flex-col gap-16">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-2">
                            {project.title?.[locale] || 'Untitled'}
                        </h1>
                        <p className="text-xl text-gray-400 font-light">
                            {project.studentName?.[locale] || 'Anonymous'}
                        </p>
                    </div>

                    <div className="border-t border-white/10 pt-8">
                        <h3 className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-4">Synopsis</h3>
                        <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-line">
                            {project.description?.[locale] || 'No description available.'}
                        </p>
                    </div>

                    {/* Stills Gallery (Masonry) */}
                    {artworks.length > 0 && (
                        <div className="border-t border-white/10 pt-8">
                            <h3 className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-6">Stills & Concept Art</h3>
                            <div className="columns-1 md:columns-2 gap-4 space-y-4">
                                {artworks.map((url, i) => (
                                    <div key={url} className="break-inside-avoid">
                                        <img
                                            src={url}
                                            alt={`Artwork ${i}`}
                                            className="w-full rounded-lg bg-neutral-900 hover:opacity-90 transition cursor-zoom-in"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Credits & Info (4 cols) */}
                <div className="md:col-span-4 flex flex-col gap-10 pt-2">
                    {/* Project Info */}
                    <div className="bg-white/5 p-6 rounded-lg border border-white/5 backdrop-blur-sm">
                        <div className="grid grid-cols-2 gap-y-6">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Year</div>
                                <div className="text-lg font-bold">{project.year}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</div>
                                <div className="text-lg font-bold text-green-400 uppercase text-xs border border-green-900 bg-green-900/20 px-2 py-1 inline-block rounded">
                                    Available
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Genres</div>
                        <div className="flex flex-wrap gap-2">
                            {project.genres?.map(g => (
                                <span key={g} className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-wider rounded-sm">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contact Button */}
                    <div className="mt-8 border-t border-white/10 pt-8">
                        <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200 transition">
                            Inquire about Rights
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
