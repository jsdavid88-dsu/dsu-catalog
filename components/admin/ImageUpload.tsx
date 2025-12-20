'use client';

import { useState } from 'react';

interface ImageUploadProps {
    label: string;
    value: string; // The download URL
    onChange: (url: string) => void;
    folder?: string;
}

export default function ImageUpload({ label, value, onChange, folder = 'uploads' }: ImageUploadProps) {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);

        try {
            const cloudName = 'duqc759dj';
            const uploadPreset = 'ml_default'; // Cloudinary default unsigned preset

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', folder);

            console.log('Uploading to Cloudinary...');

            // Upload to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Cloudinary error:', errorData);
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const data = await response.json();

            // Get the secure URL
            const downloadURL = data.secure_url;
            onChange(downloadURL);
            setProgress(100);
        } catch (error) {
            console.error("Upload error:", error);
            alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="flex items-center gap-4">
                {value && (
                    <img src={value} alt="Preview" className="h-20 w-32 object-cover rounded border border-gray-600" />
                )}
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-700 file:text-white hover:file:bg-neutral-600"
                    />
                    {uploading && (
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                            <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                    {uploading && <p className="text-xs text-gray-500 mt-1">Uploading to Cloudinary...</p>}
                </div>
            </div>
        </div>
    );
}
