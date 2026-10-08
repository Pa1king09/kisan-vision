import React, { createContext, useContext, useState } from 'react';

const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
    const [lastResult, setLastResult] = useState(null);

    return (
        <RecommendationContext.Provider value={{ lastResult, setLastResult }}>
            {children}
        </RecommendationContext.Provider>
    );
};

export const useRecommendation = () => useContext(RecommendationContext);