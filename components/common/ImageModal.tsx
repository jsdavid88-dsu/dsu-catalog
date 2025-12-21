'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageModalProps {
    isOpen: boolean;
    imageSrc: string;
    imageAlt: string;
    onClose: () => void;
}

export default function ImageModal({ isOpen, imageSrc, imageAlt, onClose }: ImageModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close modal"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Container */}
            <div
                className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="object-contain max-w-full max-h-[90vh] rounded-lg"
                />
            </div>

            {/* Instruction Text */}
            <p className="absolute bottom-4 text-white/60 text-sm">
                클릭하거나 ESC를 눌러 닫기
            </p>
        </div>
    );
}
