import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-green/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-brand-olive font-medium animate-pulse text-sm">Analyzing soil data...</p>
        </div>
    );
};

export default LoadingSpinner;
