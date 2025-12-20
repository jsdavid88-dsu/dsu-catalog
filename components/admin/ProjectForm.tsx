'use client';

import { useState, useEffect } from 'react';
import { Project, INITIAL_PROJECT_STATE } from '@/types/project';
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';
import TagSelector from './TagSelector';
import { useAuth } from '@/context/AuthContext';

type CheckKeys<T, K extends keyof T> = K;
type LocalizedField = CheckKeys<Project, 'title' | 'studentName' | 'description'>;

const GENRE_OPTIONS = [
    'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Romance',
    'Fantasy', 'Documentary', 'Experimental', 'Horror', 'Animation'
];

const TECHNIQUE_OPTIONS = [
    '3D', '2D', 'Stop Motion', 'Motion Graphics', 'VFX', 'Mixed Media', 'VR/AR'
];

interface ProjectFormProps {
    initialData?: Project;
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
    const [project, setProject] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>(INITIAL_PROJECT_STATE);
    const [activeTab, setActiveTab] = useState<'ko' | 'en' | 'ja' | 'zh'>('ko');
    const [loading, setLoading] = useState(false);
    const [translating, setTranslating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (initialData) {
            const { id, createdAt, updatedAt, ...rest } = initialData;
            setProject(rest);
        }
    }, [initialData]);

    const handleTextChange = (field: LocalizedField, value: string) => {
        setProject(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [activeTab]: value
            }
        }));
    };

    // Quick helper for simple fields
    const handleChange = (field: string, value: any) => {
        setProject(prev => ({ ...prev, [field]: value }));
    };

    const handleAutoTranslate = async () => {
        if (!project.title.ko && !project.description.ko && !project.studentName.ko) {
            alert("Please enter Korean text first.");
            return;
        }

        setTranslating(true);
        try {
            // Translate Title
            if (project.title.ko) {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: project.title.ko, targetLocales: ['en', 'ja', 'zh'] })
                });
                const data = await res.json();
                if (data.translations) {
                    setProject(prev => ({
                        ...prev,
                        title: { ...prev.title, ...data.translations }
                    }));
                }
            }

            // Translate Description
            if (project.description.ko) {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: project.description.ko, targetLocales: ['en', 'ja', 'zh'] })
                });
                const data = await res.json();
                if (data.translations) {
                    setProject(prev => ({
                        ...prev,
                        description: { ...prev.description, ...data.translations }
                    }));
                }
            }

            // Translate Name
            if (project.studentName.ko) {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: project.studentName.ko, targetLocales: ['en', 'ja', 'zh'] })
                });
                const data = await res.json();
                if (data.translations) {
                    setProject(prev => ({
                        ...prev,
                        studentName: { ...prev.studentName, ...data.translations }
                    }));
                }
            }

            alert("Auto-translation complete! Check other tabs.");

        } catch (e) {
            console.error(e);
            alert("Translation failed.");
        } finally {
            setTranslating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Basic validation
            if (!project.title.ko) throw new Error("Korean title is required");

            // Mock Data Save for Test Account
            const isMock = localStorage.getItem('mockUser');
            if (isMock) {
                const mockProjects: Project[] = JSON.parse(localStorage.getItem('mockProjects') || '[]');

                if (initialData?.id) {
                    // Update existing project
                    const index = mockProjects.findIndex(p => p.id === initialData.id);
                    const updatedProject = {
                        ...project,
                        id: initialData.id,
                        createdAt: initialData.createdAt || new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    if (index !== -1) {
                        // Update existing entry in mockProjects
                        mockProjects[index] = updatedProject;
                    } else {
                        // Project was from MOCK_DATA, add it to mockProjects as an override
                        mockProjects.push(updatedProject);
                    }

                    console.log("ProjectForm: Saving updated project to localStorage", initialData.id);
                } else {
                    // Create new project
                    const newProject = {
                        ...project,
                        id: 'mock-' + Date.now(),
                        createdBy: 'mock-admin',  // In actual use, this would be auth.currentUser.uid
                        createdByEmail: 'admin@dsu.ac.kr',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    mockProjects.unshift(newProject);
                    console.log("ProjectForm: Creating new project in localStorage");
                }

                localStorage.setItem('mockProjects', JSON.stringify(mockProjects));
                console.log("ProjectForm: mockProjects saved, count =", mockProjects.length);

                await new Promise(resolve => setTimeout(resolve, 500));
                alert(`Project ${initialData?.id ? 'updated' : 'created'} successfully!\n\nThe page will reload to show your changes.`);

                // Force full reload to ensure FeedBoard picks up changes
                window.location.href = '/admin';
                return;
            }

            // Firestore Save (Production Mode)
            if (initialData?.id) {
                // Editing existing project
                const docRef = doc(db, "projects", initialData.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Document exists in Firestore - update it
                    console.log("ProjectForm: Updating existing Firestore document");
                    await updateDoc(docRef, {
                        ...project,
                        updatedAt: serverTimestamp()
                    });
                } else {
                    // Document doesn't exist (MOCK_DATA project) - create it
                    console.log("ProjectForm: Creating Firestore document for MOCK_DATA project");
                    await setDoc(docRef, {
                        ...project,
                        id: initialData.id,
                        createdBy: auth.currentUser?.uid || 'unknown',
                        createdByEmail: auth.currentUser?.email || '',
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    });
                }
                alert('Project updated successfully!');
            } else {
                // Creating new project
                console.log("ProjectForm: Creating new Firestore document");
                await addDoc(collection(db, "projects"), {
                    ...project,
                    createdBy: auth.currentUser?.uid,
                    createdByEmail: auth.currentUser?.email || '',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                alert('Project created successfully!');
            }

            router.push('/admin');
        } catch (e: any) {
            console.error("Error saving project:", e);
            console.error("Error details:", e.code, e.message);
            const errorMsg = e.code === 'permission-denied'
                ? 'Permission denied. Check Firestore security rules.'
                : e.message || 'Unknown error';
            alert(`Error saving project: ${errorMsg}\n\nCheck browser console for details.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-white pb-20">
            {/* 1. Language Tabs & Translate Button */}
            <div className="flex justify-between items-end border-b border-gray-700 mb-4 pb-2">
                <div className="flex gap-2">
                    {['ko', 'en', 'ja', 'zh'].map((lang) => (
                        <button
                            key={lang}
                            type="button"
                            onClick={() => setActiveTab(lang as any)}
                            className={`px-4 py-2 font-medium focus:outline-none transition-colors ${activeTab === lang
                                ? 'border-b-2 border-blue-500 text-blue-400'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={translating}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase rounded transition disabled:opacity-50"
                >
                    {translating ? 'Translating...' : '✨ Auto Translate (AI)'}
                </button>
            </div>

            {/* 2. Text Inputs (Dependent on Active Tab) */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title ({activeTab.toUpperCase()})</label>
                    <input
                        type="text"
                        className="w-full bg-neutral-700 border border-neutral-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={project.title[activeTab]}
                        onChange={(e) => handleTextChange('title', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Student Name ({activeTab.toUpperCase()})</label>
                    <input
                        type="text"
                        className="w-full bg-neutral-700 border border-neutral-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={project.studentName[activeTab]}
                        onChange={(e) => handleTextChange('studentName', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description ({activeTab.toUpperCase()})</label>
                    <textarea
                        rows={4}
                        className="w-full bg-neutral-700 border border-neutral-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={project.description[activeTab]}
                        onChange={(e) => handleTextChange('description', e.target.value)}
                    />
                </div>
            </div>

            <hr className="border-gray-700" />

            {/* 3. Common Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select
                        className="w-full bg-neutral-700 border border-neutral-600 rounded p-2 transition-colors focus:ring-2 focus:ring-blue-500"
                        value={project.year}
                        onChange={(e) => handleChange('year', parseInt(e.target.value))}
                    >
                        {[2025, 2024, 2023, 2022, 2021, 2020].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                        className="w-full bg-neutral-700 border border-neutral-600 rounded p-2 transition-colors focus:ring-2 focus:ring-blue-500"
                        value={project.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div className="p-4 bg-neutral-800 rounded border border-neutral-700 space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Video Content</h3>
                    <p className="text-xs text-gray-500">
                        ⚠️ **YouTube ID만** 입력하세요, 전체 URL 아님!<br />
                        예: <code className="bg-black px-1">aKj-YTvd9MY</code> (URL: https://www.youtube.com/watch?v=<b>aKj-YTvd9MY</b>)
                    </p>
                    <div>
                        <label className="block text-xs font-medium text-blue-400 mb-1">Trailer YouTube ID</label>
                        <input
                            type="text"
                            placeholder="e.g. dQw4w9WgXcQ"
                            className="w-full bg-neutral-700 border border-neutral-600 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={project.trailerYoutubeId}
                            onChange={(e) => handleChange('trailerYoutubeId', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-purple-400 mb-1">Full Video YouTube ID</label>
                        <input
                            type="text"
                            placeholder="e.g. dQw4w9WgXcQ"
                            className="w-full bg-neutral-700 border border-neutral-600 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={project.fullYoutubeId}
                            onChange={(e) => handleChange('fullYoutubeId', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-4 bg-neutral-800 rounded border border-neutral-700">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Promotion</h3>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={project.isFeatured}
                            onChange={(e) => handleChange('isFeatured', e.target.checked)}
                            className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
                        />
                        <span className="font-bold text-blue-400 group-hover:text-blue-300 transition-colors">Featured (Main Page Promotion)</span>
                    </label>

                    <div>
                        <label className="block text-sm font-medium mb-1">Priority Order (Higher # = First)</label>
                        <input
                            type="number"
                            className="w-full bg-neutral-700 border border-neutral-600 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={project.priority}
                            onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                <div>
                    <TagSelector
                        label="Genres"
                        options={GENRE_OPTIONS}
                        selected={project.genres || []}
                        onChange={(tags) => handleChange('genres', tags)}
                    />
                </div>

                <div>
                    <TagSelector
                        label="Techniques"
                        options={TECHNIQUE_OPTIONS}
                        selected={project.technique || []}
                        onChange={(tags) => handleChange('technique', tags)}
                    />
                </div>

                <div>
                    <ImageUpload
                        label="Thumbnail Image"
                        value={project.thumbnailUrl}
                        onChange={(url) => handleChange('thumbnailUrl', url)}
                        folder="thumbnails"
                    />
                </div>

                {/* Artwork Gallery */}
                <div className="md:col-span-2 p-4 bg-neutral-800 rounded border border-neutral-700">
                    <label className="block text-sm font-medium mb-4">Gallery Artworks (Stills)</label>
                    <div className="space-y-4">
                        {project.artworkUrls.map((url, index) => (
                            <div key={index} className="flex gap-4 items-center">
                                <ImageUpload
                                    label={`Artwork #${index + 1}`}
                                    value={url}
                                    onChange={(newUrl) => {
                                        const newUrls = [...project.artworkUrls];
                                        newUrls[index] = newUrl;
                                        handleChange('artworkUrls', newUrls);
                                    }}
                                    folder="artworks"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newUrls = project.artworkUrls.filter((_, i) => i !== index);
                                        handleChange('artworkUrls', newUrls);
                                    }}
                                    className="text-red-500 hover:text-red-400 font-bold px-2 transition-colors"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleChange('artworkUrls', [...project.artworkUrls, ''])}
                            className="text-sm text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider transition-colors"
                        >
                            + Add Artwork
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-4 sticky bottom-8 flex gap-4">
                <button
                    type="button"
                    onClick={() => router.push('/admin')}
                    className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3 rounded transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition disabled:opacity-50"
                >
                    {loading ? 'Saving...' : initialData?.id ? 'Update Project' : 'Create Project'}
                </button>
            </div>

        </form>
    );
}
