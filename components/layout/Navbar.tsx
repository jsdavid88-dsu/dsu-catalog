'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function Navbar() {
    const locale = useLocale();
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 w-full z-50 mix-blend-difference text-white">
            <div className="max-w-[1920px] mx-auto px-6 h-24 flex items-center justify-between">

                {/* Logo Area - Minimal & Sharp */}
                <Link href="/" className="group flex flex-col gap-0.5">
                    <span className="font-display font-bold text-xl tracking-[0.2em] group-hover:text-neutral-400 transition-colors">
                        DSU<span className="font-light">ANIMATION</span>
                    </span>
                    <span className="text-[9px] text-white/60 tracking-[0.4em] uppercase">
                        Busan, Korea
                    </span>
                </Link>

                {/* Right: Navigation & Language */}
                <div className="flex items-center gap-10">
                    {/* New Links */}
                    <Link href="/contact" className="text-xs font-bold tracking-widest uppercase hover:text-blue-400 transition-colors">
                        Contact
                    </Link>

                    <a href="/admin/login" className="text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-white transition-colors">
                        Admin
                    </a>

                    {/* Language Switcher - Clean Text */}
                    <div className="flex items-center gap-4 text-xs font-medium tracking-widest text-neutral-500">
                        <Link href={pathname} locale="ko" className={`hover:text-white transition-colors ${locale === 'ko' ? 'text-white border-b border-white pb-0.5' : ''}`}>KO</Link>
                        <Link href={pathname} locale="en" className={`hover:text-white transition-colors ${locale === 'en' ? 'text-white border-b border-white pb-0.5' : ''}`}>EN</Link>
                        <Link href={pathname} locale="ja" className={`hover:text-white transition-colors ${locale === 'ja' ? 'text-white border-b border-white pb-0.5' : ''}`}>JP</Link>
                        <Link href={pathname} locale="zh" className={`hover:text-white transition-colors ${locale === 'zh' ? 'text-white border-b border-white pb-0.5' : ''}`}>CN</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
