'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const MOCK_PROJECTS = [
    {
        title: { en: "Cyberpunk: Edgerunners Fan", ko: "사이버펑크: 엣지러너 팬아트", ja: "サイバーパンク", zh: "赛博朋克" },
        studentName: { en: "Kim Art", ko: "김예술", ja: "キム・アート", zh: "金艺术" },
        description: {
            en: "A high-octane tribute to the neon-soaked streets of Night City. Exploring themes of transhumanism and loss.",
            ko: "나이트 시티의 네온 거리에 바치는 고속 액션 헌정작. 트랜스휴머니즘과 상실의 테마를 탐구합니다."
        },
        year: 2024,
        genres: ["Sci-Fi", "Action", "Noir"],
        technique: ["Unreal Engine 5", "Maya", "Substance"],
        youtubeId: "aqz-KE-bpKQ", // Big Buck Bunny (Safe placeholder)
        thumbnailUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1920&auto=format&fit=crop", // Cyberpunk vibe
        status: 'published'
    },
    {
        title: { en: "The Last Lantern", ko: "마지막 등불", ja: "最後のランタン", zh: "最后的灯笼" },
        studentName: { en: "Lee Motion", ko: "이모션", ja: "イ・モーション", zh: "李动作" },
        description: {
            en: "A traditional 2D animation about a spirit guiding lost souls. Hand-painted backgrounds meet digital cel animation.",
            ko: "길 잃은 영혼을 인도하는 정령에 관한 전통 2D 애니메이션. 수작업 배경과 디지털 셀 애니메이션의 조화."
        },
        year: 2023,
        genres: ["Fantasy", "Drama"],
        technique: ["TVPaint", "After Effects"],
        youtubeId: "d4q_C7kQ70g", // Sintel Trailer (placeholder)
        thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop", // Soft, warm vibe
        status: 'published'
    },
    {
        title: { en: "Mecha Protocol", ko: "메카 프로토콜", ja: "メカプロトコル", zh: "机甲协议" },
        studentName: { en: "Park VX", ko: "박브이", ja: "パク・VX", zh: "朴视觉" },
        description: {
            en: "Heavy industrial sci-fi featuring realistic hard-surface modeling and rigid body simulations.",
            ko: "사실적인 하드 서피스 모델링과 리지드 바디 시뮬레이션을 특징으로 하는 중공업 SF."
        },
        year: 2025,
        genres: ["Sci-Fi", "Mecha"],
        technique: ["Blender", "Houdini"],
        youtubeId: "mN0zPOpADL4", // Cosmos Laundromat (placeholder)
        thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop", // Gaming/Tech vibe
        status: 'published'
    },
    {
        title: { en: "Forest of Whispers", ko: "속삭임의 숲", ja: "ささやきの森", zh: "低语森林" },
        studentName: { en: "Choi Nature", ko: "최자연", ja: "チェ・ネイチャー", zh: "崔自然" },
        description: {
            en: "An atmospheric stop-motion piece utilizing felt and clay. Sound design plays a crucial role.",
            ko: "펠트와 점토를 활용한 분위기 있는 스톱모션 작품. 사운드 디자인이 핵심적인 역할을 합니다."
        },
        year: 2024,
        genres: ["Stop Motion", "Horror"],
        technique: ["Dragonframe", "Clay"],
        youtubeId: "gXfWERJJne8", // Spring (placeholder)
        thumbnailUrl: "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=1920&auto=format&fit=crop", // Nature vibe
        status: 'published'
    }
];

export default function DataSeeder() {
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        if (!confirm("Inject sample data? This will add projects to Firestore.")) return;
        setLoading(true);
        try {
            for (const p of MOCK_PROJECTS) {
                await addDoc(collection(db, "projects"), {
                    ...p,
                    // Fill missing fields with defaults
                    description: { ja: "", zh: "", ...p.description },
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    featuredOrder: 0,
                    searchKeywords: [],
                    artworkUrls: [],
                    teamMembers: []
                });
            }
            alert("Seeding Complete!");
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Seeding Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs mb-2">DEVELOPER TOOLS</p>
            <button
                onClick={handleSeed}
                disabled={loading}
                className="px-4 py-2 bg-red-900/30 text-red-400 text-sm hover:bg-red-900/50 rounded transition border border-red-900"
            >
                {loading ? "Seeding..." : "Inject 4 Mock Projects"}
            </button>
        </div>
    );
}
