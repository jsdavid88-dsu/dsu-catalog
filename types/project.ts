export interface Member {
    name: { en: string; ja: string; zh: string; ko: string };
    links: {
        behance?: string;
        artstation?: string;
        instagram?: string;
        github?: string;
        website?: string;
        email?: string;
    };
}

export interface Project {
    id?: string;
    // Metadata
    status: 'draft' | 'published' | 'archived';
    isFeatured: boolean;
    priority: number; // Higher = First

    // Content (Multi-language)
    title: { en: string; ja: string; zh: string; ko: string };
    description: { en: string; ja: string; zh: string; ko: string };

    // Member Info
    members: Member[];

    // Legacy / Backwards Compatibility
    studentName?: { en: string; ja: string; zh: string; ko: string };
    teamMembers?: string[];

    // Search & Filter
    year: number;
    genres: string[];
    technique: string[];
    searchKeywords?: string[];

    // Media
    thumbnailUrl: string;
    youtubeId: string; // Deprecated or for general use
    trailerYoutubeId: string;
    fullYoutubeId: string;
    artworkUrls: string[];

    // Engagement
    views?: number;

    // Ownership & Permissions
    createdBy?: string;  // User UID who created this project
    createdByEmail?: string;  // Email for display purposes

    createdAt: any; // Firestore Timestamp
    updatedAt: any;
}

export const INITIAL_PROJECT_STATE: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
    status: 'draft',
    isFeatured: false,
    priority: 0,
    title: { en: '', ja: '', zh: '', ko: '' },
    description: { en: '', ja: '', zh: '', ko: '' },
    members: [{
        name: { en: '', ja: '', zh: '', ko: '' },
        links: {}
    }],
    year: new Date().getFullYear(),
    genres: [],
    technique: [],
    thumbnailUrl: '',
    youtubeId: '',
    trailerYoutubeId: '',
    fullYoutubeId: '',
    artworkUrls: [],
    views: 0,
    createdBy: undefined,
    createdByEmail: undefined
};
