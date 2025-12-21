'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types/project';
import { useInView } from 'react-intersection-observer';
import { Link } from '@/i18n/navigation';
import { optimizeCloudinary } from '@/lib/cloudinary';

interface FeedCardProps {
    project: Project;
    locale: 'ko' | 'en' | 'ja' | 'zh';
}

export default function FeedCard({ project, locale }: FeedCardProps) {
    const [hovered, setHovered] = useState(false);
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const trailerId = project.trailerYoutubeId || project.youtubeId;
    const isPlaying = hovered && !!trailerId;

    // Safety check for locale-based values
    const getSafeValue = (obj: any, key: string, fallback: string = '') => {
        if (!obj) return fallback;
        return obj[key] || obj['ko'] || obj['en'] || fallback;
    };

    const title = getSafeValue(project.title, locale, 'Untitled Project');

    // Member names logic
    const memberNames = (project.members ?? []).length > 0
        ? (project.members ?? []).map(m => getSafeValue(m.name, locale)).join(', ')
        : getSafeValue(project.studentName, locale, 'Anonymous');

    const student = memberNames;
    const desc = getSafeValue(project.description, locale, 'No description available for this project.');

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="w-full group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Media Area */}
            <Link href={`/project/${project.id || ''}`}>
                <div className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    {/* Thumbnail */}
                    <div
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
                        style={{ backgroundImage: `url(${optimizeCloudinary(project.thumbnailUrl, { width: 800 }) || 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop'})` }}
                    >
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                    </div>

                    {/* YouTube Embed */}
                    {isPlaying && (
                        <div className="absolute inset-0">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
                                title={title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Hover Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{project.year}</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Metadata Area */}
            <div className="mt-4 space-y-2 px-1">
                <div className="flex justify-between items-start gap-4">
                    <Link href={`/project/${project.id || ''}`} className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                            {title}
                        </h3>
                    </Link>
                    <span className="text-xs font-medium text-zinc-500 tracking-wider uppercase pt-1">
                        {project.year}
                    </span>
                </div>

                <p className="text-sm text-zinc-400 font-medium">{student}</p>

                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed h-8">
                    {desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.genres?.slice(0, 2).map(g => (
                        <span key={g} className="text-[9px] font-bold uppercase tracking-tighter bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                            {g}
                        </span>
                    ))}
                    {project.technique?.slice(0, 1).map(t => (
                        <span key={t} className="text-[9px] font-bold uppercase tracking-tighter bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
