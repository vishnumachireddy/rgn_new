import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator,
    TrendingUp,
    Info,
    DollarSign,
    Loader2,
    Calendar,
    AlertTriangle,
    BarChart3,
    Warehouse,
    Target,
    Zap
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const ProfitEstimator = () => {
    const [inputs, setInputs] = useState({
        crop_name: 'Rice',
        land_size: 5,
        yield_per_acre: 25,
        production_cost: 50000,
        months_to_store: 2
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'comparison' | 'sell' | 'store'>('comparison');

    const handleEstimate = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/ai/profit-strategy`, inputs);
            setResult(res.data);
            setActiveTab('comparison');
        } catch (err: any) {
            alert(err.response?.data?.detail || "Estimation failed.");
        } finally {
            setLoading(false);
        }
    };

    const getProfitColor = (val: number) => val >= 0 ? 'text-emerald-400' : 'text-red-400';
    const getProfitBg = (val: number) => val >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20';

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="text-left mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary/20 rounded-2xl text-primary-light">
                        <Calculator size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black">
                            Strategic Profit <span className="text-primary-light">Optimizer</span>
                        </h1>
                        <p className="text-white/40 font-medium uppercase tracking-[0.2em] text-xs">Market-Aware Financial Intelligence</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Parameters Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-6 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-xs uppercase tracking-widest text-white/40">Market Parameters</h3>
                            <Info size={14} className="text-white/20" />
                        </div>

                        <div className="space-y-4">
                            <InputGroup label="Crop Name" icon={<Zap size={14} />}>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm appearance-none cursor-pointer"
                                    value={inputs.crop_name}
                                    onChange={(e) => setInputs({ ...inputs, crop_name: e.target.value })}
                                >
                                    {['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Soybean', 'Groundnut'].map(c => (
                                        <option key={c} value={c} className="bg-bg-dark">{c}</option>
                                    ))}
                                </select>
                            </InputGroup>

                            <InputGroup label="Land Size (Acres)" icon={<Target size={14} />}>
                                <input
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold"
                                    value={inputs.land_size}
                                    onChange={(e) => setInputs({ ...inputs, land_size: parseFloat(e.target.value) })}
                                />
                            </InputGroup>

                            <InputGroup label="Yield Per Acre (Quintal)" icon={<TrendingUp size={14} />}>
                                <input
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold"
                                    value={inputs.yield_per_acre}
                                    onChange={(e) => setInputs({ ...inputs, yield_per_acre: parseFloat(e.target.value) })}
                                />
                            </InputGroup>

                            <InputGroup label="Total Production Cost (₹)" icon={<DollarSign size={14} />}>
                                <input
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold"
                                    value={inputs.production_cost}
                                    onChange={(e) => setInputs({ ...inputs, production_cost: parseFloat(e.target.value) })}
                                />
                            </InputGroup>

                            <InputGroup label="Storage Duration (Months)" icon={<Calendar size={14} />}>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm appearance-none cursor-pointer"
                                    value={inputs.months_to_store}
                                    onChange={(e) => setInputs({ ...inputs, months_to_store: parseInt(e.target.value) })}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(m => (
                                        <option key={m} value={m} className="bg-bg-dark">{m} Month{m > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </InputGroup>
                        </div>

                        <button
                            onClick={handleEstimate}
                            disabled={loading}
                            className="w-full btn-primary py-4 mt-6 flex items-center justify-center gap-2 group font-bold tracking-widest text-xs uppercase"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <BarChart3 size={18} />}
                            {loading ? 'Analyzing...' : 'Execute Strategy Scan'}
                        </button>
                    </div>
                </div>

                {/* Analysis Engine */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                {/* Strategy Recommendation Badge */}
                                <div className={`p-6 rounded-[2rem] border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${getProfitBg(Math.max(result.sell_now_profit, result.store_profit))}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-white/10 rounded-2xl">
                                            <TrendingUp size={32} className={getProfitColor(Math.max(result.sell_now_profit, result.store_profit))} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">AI Recommendation</p>
                                            <h2 className="text-2xl font-black">{result.recommended_strategy}</h2>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="bg-white/5 px-6 py-3 rounded-2xl text-center">
                                            <p className="text-[10px] font-black uppercase opacity-30 mb-1">Risk Score</p>
                                            <p className={`text-xl font-black ${result.risk_score < 20 ? 'text-emerald-400' : 'text-amber-400'}`}>{result.risk_score}%</p>
                                        </div>
                                        <div className="bg-white/5 px-6 py-3 rounded-2xl text-center border border-white/10">
                                            <p className="text-[10px] font-black uppercase opacity-30 mb-1">Max Potential</p>
                                            <p className="text-xl font-black text-primary-light">₹{Math.max(result.sell_now_profit, result.store_profit).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex p-1 bg-white/5 rounded-2xl w-fit">
                                    <TabButton active={activeTab === 'comparison'} onClick={() => setActiveTab('comparison')} label="Strategy Comparison" />
                                    <TabButton active={activeTab === 'sell'} onClick={() => setActiveTab('sell')} label="Sell Now" />
                                    <TabButton active={activeTab === 'store'} onClick={() => setActiveTab('store')} label="Store & Sell" />
                                </div>

                                {/* Tab Content */}
                                <div className="glass-card p-8">
                                    {activeTab === 'comparison' && (
                                        <div className="space-y-8">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-black flex items-center gap-2">
                                                    <BarChart3 className="text-primary-light" size={20} />
                                                    Profit Comparison
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs font-bold opacity-40">
                                                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-primary rounded-full" /> Sell Now</span>
                                                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-accent rounded-full" /> Store & Sell</span>
                                                </div>
                                            </div>

                                            <div className="h-[350px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={[
                                                            { name: 'Strategy Comparison', sell: result.sell_now_profit, store: result.store_profit }
                                                        ]}
                                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <XAxis dataKey="name" hide />
                                                        <YAxis
                                                            stroke="#ffffff20"
                                                            fontSize={10}
                                                            tickFormatter={(value) => `₹${value / 1000}k`}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#052c22', border: 'none', borderRadius: '12px' }}
                                                            itemStyle={{ fontWeight: 'bold' }}
                                                        />
                                                        <Bar dataKey="sell" fill="#10b981" radius={[10, 10, 0, 0]} name="Sell Now Profit" />
                                                        <Bar dataKey="store" fill="#3b82f6" radius={[10, 10, 0, 0]} name="Future Profit" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ComparisonCard title="Sell Now Strategy" profit={result.sell_now_profit} price={result.current_price} icon={<Zap />} color="border-emerald-500/20" />
                                                <ComparisonCard title="Storage Strategy" profit={result.store_profit} price={result.future_price} icon={<Warehouse />} color="border-blue-500/20" />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'sell' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                                    <Zap size={24} />
                                                </div>
                                                <h3 className="text-2xl font-black">Sell Now Analysis</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <DetailBox label="Predicted Mkt Price" value={`₹${result.current_price}`} />
                                                <DetailBox label="Production Cost" value={`₹${inputs.production_cost}`} />
                                                <DetailBox label="Net Profit" value={`₹${result.sell_now_profit}`} highlight />
                                            </div>
                                            <p className="text-white/40 text-sm bg-white/2 p-4 rounded-xl border border-white/5">
                                                Selling immediately eliminates market volatility risk and storage degradation. Recommended if immediate capital is required for next season's sowing.
                                            </p>
                                        </div>
                                    )}

                                    {activeTab === 'store' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                                    <Warehouse size={24} />
                                                </div>
                                                <h3 className="text-2xl font-black">Storage & Future Analysis</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <DetailBox label="Forecasted Price" value={`₹${result.future_price}`} />
                                                <DetailBox label="Risk Penalty" value={`${result.risk_score}%`} />
                                                <DetailBox label="Future Net Profit" value={`₹${result.store_profit}`} highlight />
                                            </div>
                                            <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-200 text-xs">
                                                <AlertTriangle size={18} className="shrink-0" />
                                                <p>Warning: Future price forecasting is based on historical supply-demand patterns. Unexpected weather events or policy changes can impact these projections by +15%/-15%.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Explanation Footer */}
                                <div className="p-6 bg-white/2 border border-white/5 rounded-3xl">
                                    <p className="text-white/30 text-[10px] leading-relaxed italic uppercase tracking-widest text-center">
                                        {result.ai_explanation}
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[500px] flex items-center justify-center border-2 border-dashed border-white/10 rounded-[3rem] p-20 text-center bg-white/2">
                                <div className="max-w-md">
                                    <div className="p-8 bg-white/5 rounded-full w-fit mx-auto mb-6">
                                        <TrendingUp size={64} className="text-white/10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white/40 mb-3 tracking-widest uppercase">Analysis Engine Idle</h3>
                                    <p className="text-white/20">Input your production metrics and target storage duration to generate an AI-powered market strategy.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, icon, children }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
            {icon} {label}
        </label>
        {children}
    </div>
);

const TabButton = ({ active, onClick, label }: any) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${active ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'
            }`}
    >
        {label}
    </button>
);

const ComparisonCard = ({ title, profit, price, icon, color }: any) => (
    <div className={`p-6 rounded-3xl bg-white/2 border ${color} flex items-center gap-4`}>
        <div className="p-3 bg-white/5 rounded-2xl opacity-40">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase opacity-30 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-black">₹{profit.toLocaleString()}</span>
                <span className="text-xs opacity-40 font-bold">@ ₹{price}</span>
            </div>
        </div>
    </div>
);

const DetailBox = ({ label, value, highlight }: any) => (
    <div className={`p-6 rounded-2xl ${highlight ? 'bg-primary/20 border border-primary/30' : 'bg-white/5'}`}>
        <p className="text-[10px] font-black uppercase opacity-40 mb-2 tracking-widest">{label}</p>
        <p className={`text-2xl font-black ${highlight ? 'text-primary-light' : 'text-white'}`}>{value.toLocaleString()}</p>
    </div>
);

export default ProfitEstimator;
