import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, CheckCircle, Sprout, Info, AlertTriangle, CheckSquare } from 'lucide-react';
import T, { TD } from '../T';
import useTranslate from '../../hooks/useTranslate';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="premium-card p-5 relative overflow-hidden group"
    >
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${colorClass}`} />
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em]"><T>{title}</T></h3>
            <div className={`p-2 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon size={18} className={colorClass.replace('bg-', 'text-')} />
            </div>
        </div>
        <div className="space-y-1">
            <h2 className="text-3xl font-black text-brand-text-primary tracking-tight">
                <TD value={String(value)} />
            </h2>
            <p className="text-xs font-medium text-brand-text-tertiary"><T>{subtitle}</T></p>
        </div>
    </motion.div>
);

const HistoryAnalytics = ({ analytics, insights }) => {
    const { tBatch, language } = useTranslate();
    const [translatedCropData, setTranslatedCropData] = React.useState([]);
    const [translatedTrendsData, setTranslatedTrendsData] = React.useState([]);

    React.useEffect(() => {
        if (!analytics.cropDistribution || analytics.cropDistribution.length === 0) {
            setTranslatedCropData([]);
            return;
        }
        let cancelled = false;
        const names = analytics.cropDistribution.map(c => c.name);
        tBatch(names).then(translatedNames => {
            if (cancelled) return;
            const mapped = analytics.cropDistribution.map((c, idx) => ({
                ...c,
                name: translatedNames[idx]
            }));
            setTranslatedCropData(mapped);
        });
        return () => { cancelled = true; };
    }, [analytics.cropDistribution, language, tBatch]);

    React.useEffect(() => {
        if (!analytics.seasonalTrends || analytics.seasonalTrends.length === 0) {
            setTranslatedTrendsData([]);
            return;
        }
        let cancelled = false;
        const names = analytics.seasonalTrends.map(t => t.name);
        tBatch(names).then(translatedNames => {
            if (cancelled) return;
            const mapped = analytics.seasonalTrends.map((t, idx) => ({
                ...t,
                name: translatedNames[idx]
            }));
            setTranslatedTrendsData(mapped);
        });
        return () => { cancelled = true; };
    }, [analytics.seasonalTrends, language, tBatch]);

    const cropData = translatedCropData.length > 0 ? translatedCropData : (analytics.cropDistribution || []);
    const trendsData = translatedTrendsData.length > 0 ? translatedTrendsData : (analytics.seasonalTrends || []);

    return (
        <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Analyses" 
                    value={analytics.totalAnalyses} 
                    subtitle="Records found"
                    icon={Target}
                    colorClass="bg-blue-500 text-blue-500"
                />
                <StatCard 
                    title="Avg Confidence" 
                    value={`${analytics.averageConfidence}%`} 
                    subtitle="Model certainty"
                    icon={TrendingUp}
                    colorClass="bg-emerald-500 text-emerald-500"
                />
                <StatCard 
                    title="Top Crop" 
                    value={analytics.mostRecommendedCrop} 
                    subtitle="Most frequent"
                    icon={Sprout}
                    colorClass="bg-amber-500 text-amber-500"
                />
                <StatCard 
                    title="Success Rate" 
                    value={`${analytics.successRate}%`} 
                    subtitle="Confidence > 80%"
                    icon={CheckCircle}
                    colorClass="bg-purple-500 text-purple-500"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Crop Distribution */}
                <div className="premium-card p-5 md:col-span-1 flex flex-col">
                    <h3 className="text-xs font-black text-brand-text-primary uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
                        <PieChart size={14} className="text-brand-primary" />
                        <T>Crop Distribution</T>
                    </h3>
                    <div className="flex-1 min-h-[200px]">
                        {cropData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={cropData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {cropData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--surface-solid)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm font-bold text-brand-text-secondary"><T>No data available</T></div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        {cropData.map((c, i) => (
                            <div key={c.name} className="flex items-center gap-1.5 text-[10px] font-bold text-brand-text-secondary">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <TD value={c.name} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seasonal Trends */}
                <div className="premium-card p-5 md:col-span-1">
                    <h3 className="text-xs font-black text-brand-text-primary uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
                        <TrendingUp size={14} className="text-brand-primary" />
                        <T>Seasonal Activity</T>
                    </h3>
                    <div className="h-[200px] w-full">
                        {trendsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendsData}>
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 700 }} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip 
                                        cursor={{ fill: 'var(--surface-inset)' }}
                                        contentStyle={{ backgroundColor: 'var(--surface-solid)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '12px' }}
                                    />
                                    <Bar dataKey="Analyses" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm font-bold text-brand-text-secondary"><T>No data available</T></div>
                        )}
                    </div>
                </div>

                {/* AI Insights */}
                <div className="premium-card p-5 md:col-span-1 bg-gradient-to-br from-brand-surface to-brand-primary/5 border-brand-primary/20">
                    <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                        <T>AI Insights</T>
                    </h3>
                    <div className="space-y-3">
                        {insights.length > 0 ? insights.map((insight, idx) => {
                            let Icon = Info;
                            let color = "text-blue-500 bg-blue-500/10";
                            if (insight.type === 'warning') { Icon = AlertTriangle; color = "text-amber-500 bg-amber-500/10"; }
                            if (insight.type === 'success') { Icon = CheckSquare; color = "text-emerald-500 bg-emerald-500/10"; }

                            return (
                                <div key={idx} className="flex gap-3 items-start p-3 rounded-xl bg-brand-surface border border-brand-border/50 shadow-sm">
                                    <div className={`p-1.5 rounded-lg shrink-0 ${color}`}>
                                        <Icon size={14} />
                                    </div>
                                    <p className="text-xs font-medium text-brand-text-secondary leading-relaxed"><TD value={insight.text} /></p>
                                </div>
                            );
                        }) : (
                            <div className="text-sm font-medium text-brand-text-secondary"><T>Add more history to generate insights.</T></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryAnalytics;
