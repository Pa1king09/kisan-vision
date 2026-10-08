export const generateAnalytics = (history = []) => {
    if (!history || history.length === 0) {
        return {
            totalAnalyses: 0,
            averageConfidence: 0,
            mostRecommendedCrop: '-',
            bestSoilType: '-',
            successRate: 0,
            cropDistribution: [],
            seasonalTrends: []
        };
    }

    const totalAnalyses = history.length;
    let totalConfidence = 0;
    const cropCounts = {};
    const soilCounts = {};
    const seasonCounts = { Summer: 0, Winter: 0, Monsoon: 0, Spring: 0, Autumn: 0 };
    
    // Process items
    history.forEach(item => {
        const crop = item.predictionResult?.crop || 'Unknown';
        const confidence = item.predictionResult?.confidence || 0;
        const soil = item.soilType || 'Unknown';
        const season = item.environmentalData?.season || 'Monsoon';
        
        totalConfidence += confidence;
        cropCounts[crop] = (cropCounts[crop] || 0) + 1;
        soilCounts[soil] = (soilCounts[soil] || 0) + 1;
        
        // Ensure season is matched (basic normalization)
        const matchedSeason = Object.keys(seasonCounts).find(s => season.toLowerCase().includes(s.toLowerCase()));
        if (matchedSeason) {
            seasonCounts[matchedSeason] += 1;
        } else {
            seasonCounts['Monsoon'] += 1;
        }
    });

    const averageConfidence = (totalConfidence / totalAnalyses) * 100;
    
    // Find most recommended crop
    const mostRecommendedCrop = Object.keys(cropCounts).reduce((a, b) => cropCounts[a] > cropCounts[b] ? a : b, '-');
    const bestSoilType = Object.keys(soilCounts).reduce((a, b) => soilCounts[a] > soilCounts[b] ? a : b, '-');
    
    // Consider success rate as percentage of predictions with confidence > 80%
    const highConfidenceCount = history.filter(h => (h.predictionResult?.confidence || 0) > 0.8).length;
    const successRate = (highConfidenceCount / totalAnalyses) * 100;

    // Format for Recharts
    const cropDistribution = Object.keys(cropCounts)
        .map(name => ({ name, value: cropCounts[name] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5

    const seasonalTrends = Object.keys(seasonCounts).map(name => ({
        name,
        Analyses: seasonCounts[name]
    })).filter(s => s.Analyses > 0);

    return {
        totalAnalyses,
        averageConfidence: averageConfidence.toFixed(1),
        mostRecommendedCrop,
        bestSoilType,
        successRate: successRate.toFixed(1),
        cropDistribution,
        seasonalTrends
    };
};

export const generateAIInsights = (analytics, history) => {
    if (!history || history.length === 0) return [];
    
    const insights = [];
    
    if (analytics.mostRecommendedCrop !== '-') {
        insights.push({
            type: 'trend',
            text: `${analytics.mostRecommendedCrop} is your most frequently recommended crop, making up ${Math.round((analytics.cropDistribution[0]?.value / analytics.totalAnalyses) * 100)}% of analyses.`
        });
    }

    if (analytics.averageConfidence < 75) {
        insights.push({
            type: 'warning',
            text: `Average confidence is ${analytics.averageConfidence}%. Consider providing more accurate manual soil test data instead of AI estimates.`
        });
    } else {
        insights.push({
            type: 'success',
            text: `High prediction confidence! Your environmental patterns match well with our training datasets.`
        });
    }

    if (analytics.bestSoilType !== '-') {
        insights.push({
            type: 'info',
            text: `${analytics.bestSoilType} soil has triggered the most analyses. Consider long-term soil health management plans for this type.`
        });
    }

    return insights;
};
