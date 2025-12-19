import React from 'react';

interface TagSelectorProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (tags: string[]) => void;
}

export default function TagSelector({ label, options, selected, onChange }: TagSelectorProps) {
    const toggleTag = (tag: string) => {
        if (selected.includes(tag)) {
            onChange(selected.filter(t => t !== tag));
        } else {
            onChange([...selected, tag]);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map(tag => {
                    const isSelected = selected.includes(tag);
                    return (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${isSelected
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50'
                                    : 'bg-neutral-800 border-neutral-700 text-gray-400 hover:border-gray-500 hover:text-white'
                                }`}
                        >
                            {tag}
                        </button>
                    );
                })}
            </div>
            {/* Fallback for custom tags not in options */}
            <div className="text-xs text-gray-500 mt-1">
                Selected: {selected.join(', ') || 'None'}
            </div>
        </div>
    );
}
