import React, { useState, useEffect } from 'react';
import { Sprout } from 'lucide-react';
import { getCropData } from '../utils/cropImages';

/**
 * Reusable Crop Image component that renders high-definition crop photography
 * beside crop names.
 * Uses local bundled close-up images for instantaneous loading (0ms delay)
 * and sharp, isolated product visuals of the actual crop, vegetable, or fruit.
 */
const CropImage = ({
    crop,
    alt,
    size = 'md',
    className = '',
    rounded = 'rounded-3xl',
    showBadge = false,
    priority = false
}) => {
    const [imageError, setImageError] = useState(false);

    const cropData = getCropData(crop);
    const altText = alt || cropData.name || crop || 'Crop Image';

    // Reset error state when crop changes
    useEffect(() => {
        setImageError(false);
    }, [crop, cropData.url]);

    // Dimension presets
    const sizeClasses = {
        xs: 'w-7 h-7 min-w-[28px]',
        sm: 'w-10 h-10 min-w-[40px]',
        md: 'w-14 h-14 min-w-[56px]',
        lg: 'w-24 h-24 md:w-28 md:h-28 min-w-[96px]',
        xl: 'w-32 h-32 md:w-40 md:h-40 min-w-[128px]',
        hero: 'w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 min-w-[144px]'
    };

    const containerSize = sizeClasses[size] || sizeClasses.md;

    return (
        <div className={`relative shrink-0 overflow-hidden select-none ${containerSize} ${rounded} ${className} shadow-sm group border border-brand-border bg-brand-surface-inset`}>
            {/* Actual close-up crop image (loads immediately from local bundle) */}
            {!imageError ? (
                <img
                    key={cropData.url}
                    src={cropData.url}
                    alt={altText}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                />
            ) : (
                /* Distinct fallback if image missing */
                <div className="w-full h-full flex flex-col items-center justify-center bg-brand-surface-inset text-brand-primary p-2 text-center">
                    <span className="text-3xl mb-1">{cropData.emoji}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-brand-text-secondary truncate max-w-full">
                        {cropData.name || crop}
                    </span>
                </div>
            )}

            {/* Subtle gloss border overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] border border-white/10" />

            {/* Optional mini verified leaf badge */}
            {showBadge && (
                <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-brand-primary text-slate-950 shadow-md">
                    <Sprout size={12} />
                </div>
            )}
        </div>
    );
};

export default CropImage;
