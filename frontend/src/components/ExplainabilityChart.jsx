import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

/**
 * ExplainabilityChart Component
 * Renders a SHAP value visualization with plain-English descriptions.
 * 
 * @param {Object} props.explanation - Object containing feature impacts (e.g., { "Soil Type": 0.38, ... })
 */
const ExplainabilityChart = ({ explanation }) => {
    if (!explanation || Object.keys(explanation).length === 0) {
        return null;
    }

    // Descriptions mapping as per requirement
    const descriptions = {
        "Rainfall Level": "Rainfall pattern was the biggest factor in choosing this crop",
        "Soil Type": "Your soil type strongly matched this crop's needs",
        "Season": "The current season aligns well with this crop's growth cycle",
        "Humidity Level": "Humidity level supported this crop choice",
        "Temperature": "Temperature played a supporting role in this decision"
    };

    // Sort features by SHAP value descending
    const data = Object.entries(explanation)
        .map(([name, value]) => ({
            name,
            value: Number(value),
            description: descriptions[name] || "This factor influenced the recommendation."
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <div className="w-full py-6">
            <h3 className="text-xl font-bold text-brand-dark mb-8 text-center text-gradient">
                What influenced this recommendation?
            </h3>

            {/* Chart Visualization */}
            <div className="h-[300px] w-full mb-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={120}
                            tick={{ fill: '#4a4a4a', fontSize: 12, fontWeight: 600 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-brand-dark text-white p-2 rounded shadow-2xl text-xs border border-white/10 backdrop-blur-md">
                                            <span className="font-bold text-brand-gold">{payload[0].payload.name}</span>: {payload[0].value.toFixed(4)}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[0, 6, 6, 0]}
                            barSize={28}
                            isAnimationActive={true}
                            animationDuration={1400}
                            animationEasing="ease-out"
                            animationBegin={300}
                            style={{ filter: 'drop-shadow(0px 2px 4px rgba(76, 175, 80, 0.3))' }}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#4CAF50" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Feature-by-feature descriptions - fulfilling "Below each bar" requirement */}
            <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-olive opacity-60 mb-4">Key Insights</p>
                {data.map((item, index) => (
                    <div key={index} className="group relative pl-6 py-2 border-l-2 border-transparent hover:border-brand-green transition-all duration-300">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#4CAF50] scale-75 group-hover:scale-100 transition-transform" />
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-brand-olive/70 uppercase tracking-tight">
                                {item.name}
                            </span>
                        </div>
                        <p className="text-sm md:text-base text-brand-dark font-medium leading-tight">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExplainabilityChart;
