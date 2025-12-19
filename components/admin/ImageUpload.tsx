'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

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
        const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(p);
            },
            (error) => {
                console.error("Upload error:", error);
                setUploading(false);
                alert('Upload failed');
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                onChange(downloadURL);
                setUploading(false);
            }
        );
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
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
