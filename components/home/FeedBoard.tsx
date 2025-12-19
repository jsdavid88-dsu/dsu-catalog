'use client';

import { useEffect, useState, useMemo } from 'react';
import { Project } from '@/types/project';
import FeedCard from './FeedCard';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_DATA } from '@/data/projects_v2';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface FeedBoardProps {
    locale: 'ko' | 'en' | 'ja' | 'zh';
}

const FILTERS = ["All", "3D", "2D", "Sci-Fi", "Fantasy", "Stop Motion"];

export default function FeedBoard({ locale }: FeedBoardProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // 1. Initial Data Loading
    useEffect(() => {
        const initData = async () => {
            try {
                const isMock = localStorage.getItem('mockUser');
                if (isMock) {
                    console.log("Loading projects with Mock Mode enabled...");
                    const localProjects = JSON.parse(localStorage.getItem('mockProjects') || '[]');

                    // Merge MOCK_DATA with local storage, prioritizing local edits
                    const projectMap = new Map<string, Project>();
                    MOCK_DATA.forEach(p => projectMap.set(p.id!, p));
                    localProjects.forEach((p: Project) => projectMap.set(p.id!, p));

                    setProjects(Array.from(projectMap.values()));
                } else {
                    console.log("Loading projects from Firestore + MOCK_DATA...");

                    // Fetch only published projects from Firestore
                    const q = query(collection(db, "projects"), where("status", "==", "published"));
                    const snapshot = await getDocs(q);
                    const firestoreProjects = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as Project));

                    console.log(`Loaded ${firestoreProjects.length} published projects from Firestore`);

                    // Merge: Start with MOCK_DATA, then override with Firestore (Firestore takes priority)
                    const projectMap = new Map<string, Project>();
                    MOCK_DATA.forEach(p => projectMap.set(p.id!, p));
                    firestoreProjects.forEach(p => projectMap.set(p.id!, p));

                    setProjects(Array.from(projectMap.values()));
                }
            } catch (err) {
                console.error("Failed to initialize projects:", err);
                setProjects(MOCK_DATA as unknown as Project[]);
            } finally {
                // Short delay to ensure smooth transition
                setTimeout(() => setLoading(false), 500);
            }
        };
        initData();
    }, []);

    // 2. Optimized Filtering Logic
    const filteredProjects = useMemo(() => {
        try {
            let result = [...projects];

            // Category Filter
            if (activeFilter !== "All") {
                result = result.filter(p => {
                    const tags = [...(p.genres || []), ...(p.technique || [])];
                    const isExactlyMatch = tags.some(t => t.toLowerCase() === activeFilter.toLowerCase());

                    // Fuzzy match for common categories
                    if (activeFilter === "3D") {
                        return isExactlyMatch || tags.some(t => ["Maya", "Blender", "Unreal"].some(k => t.includes(k)));
                    }
                    return isExactlyMatch;
                });
            }

            // Search Filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                result = result.filter(p => {
                    const tKo = p.title?.ko?.toLowerCase() || "";
                    const tEn = p.title?.en?.toLowerCase() || "";
                    const sKo = p.studentName?.ko?.toLowerCase() || "";
                    const sEn = p.studentName?.en?.toLowerCase() || "";
                    return tKo.includes(q) || tEn.includes(q) || sKo.includes(q) || sEn.includes(q);
                });
            }

            return result;
        } catch (err) {
            console.error("Filtering logic crashed:", err);
            return projects;
        }
    }, [projects, activeFilter, searchQuery]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="font-display text-white text-xl animate-pulse tracking-widest uppercase">Loading Archive...</p>
                    <div className="w-48 h-1 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-zinc-950 pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-[1920px] mx-auto flex flex-col items-center">

                {/* Header */}
                <div className="mb-12 text-center space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-widest leading-tight"
                    >
                        Dongseo University<br />
                        <span className="text-blue-500">Animation & VFX</span><br />
                        IP Archive
                    </motion.h1>
                    <p className="text-gray-500 text-xs md:text-sm tracking-[0.5em] uppercase">
                        Busan, South Korea
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-xl mb-12 relative group">
                    <input
                        type="text"
                        placeholder="Search Title, Student Name, or Keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-900/50 border border-neutral-700 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm tracking-wide"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${activeFilter === filter
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-500 hover:text-white'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Grid Layout */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <FeedCard
                                key={project.id || Math.random().toString()}
                                project={project}
                                locale={locale}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-20 text-gray-500"
                    >
                        No projects found for "{searchQuery || activeFilter}".
                    </motion.div>
                )}

            </div>
        </div>
    );
}
