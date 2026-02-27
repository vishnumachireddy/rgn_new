import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    ShoppingBag,
    Sprout,
    MapPin,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const data = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
];

const DashboardHome = () => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/weather/advisory?lat=17.3850&lon=78.4867');
                setWeather(res.data);
            } catch (err) {
                console.error("Dashboard weather sync failed");
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2">Welcome Back, <span className="text-primary-light">{user.name || 'Farmer'}</span></h1>
                    <p className="text-white/60 font-medium">Monitoring your agricultural cluster <span className="text-primary-light bg-primary/10 px-2 py-0.5 rounded-lg text-sm font-bold ml-2">ID: {user.id || 'FRM10001'}</span></p>
                </div>
                <div className="flex items-center gap-5 glass-card !p-4 !m-0 border-white/5 shadow-xl">
                    <div className="text-right">
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-none mb-1">Regional Weather</p>
                        {loading ? <Loader2 className="animate-spin ml-auto" size={16} /> : <p className="text-lg font-black text-white">{weather?.temp}°C / {weather?.condition}</p>}
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="p-2 bg-primary/10 rounded-xl text-primary-light">
                        <MapPin size={24} />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="₹45,200" change="+12.5%" icon={<TrendingUp />} color="text-green-400" />
                <StatCard title="Active Listings" value="8 Crops" change="+1 New" icon={<ShoppingBag />} color="text-blue-400" />
                <StatCard title="Growth Yield" value="2.4 Tons" change="+14.1%" icon={<Sprout />} color="text-primary-light" />
                <StatCard title="System Alerts" value="0 Critical" change="None" icon={<CheckCircle2 />} color="text-accent" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 glass-card h-[400px] border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <TrendingUp size={200} />
                    </div>
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <h3 className="text-xl font-black">Revenue Analytics</h3>
                        <div className="flex bg-white/5 p-1 rounded-xl gap-1">
                            {['7D', '30D', '1Y'].map(t => (
                                <button key={t} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${t === '7D' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/20 hover:text-white/40'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[260px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#ffffff20" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#022c22', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Dashboard Advice */}
                <div className="glass-card border-white/5 flex flex-col h-full bg-primary/5">
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                        <Sprout className="text-primary-light" />
                        AI Focus Advice
                    </h3>
                    <div className="flex-1 space-y-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <p className="text-xs font-black text-primary-light uppercase tracking-widest mb-2">Climate Context</p>
                            <p className="text-white/80 italic leading-relaxed">
                                {weather?.ai_advisory || "Predicting upcoming micro-climate shifts. Keep an eye on the Weather tab for LLM-powered irrigation alerts."}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <SmallInfo label="Soil Health" value="8.4/10" />
                            <SmallInfo label="Market Demand" value="Rising" />
                        </div>
                    </div>
                    <button className="btn-primary w-full mt-8 py-4">Explore Marketplace</button>
                </div>
            </div>

            {/* AI Crop Suitability Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-primary via-primary/80 to-accent border border-white/20 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-primary/20"
            >
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <Sprout size={200} />
                </div>
                <div className="relative z-10 max-w-3xl">
                    <div className="flex items-center gap-3 text-white/80 font-black uppercase tracking-[0.3em] text-xs mb-4">
                        <CheckCircle2 size={16} />
                        Live Intelligence Recommendation
                    </div>
                    <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                        Your land is <span className="underline decoration-white/40">Highly Compatible</span> for optimized Maize cultivation this season.
                    </h2>
                    <div className="flex gap-4">
                        <button className="bg-white text-primary font-black px-8 py-4 rounded-2xl hover:bg-white/90 transition-all text-sm uppercase tracking-wider shadow-lg">View Model Data</button>
                        <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/20 transition-all text-sm uppercase tracking-wider">Dismiss</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const StatCard = ({ title, value, change, icon, color }: any) => (
    <div className="glass-card flex items-center justify-between group hover:border-primary/50 transition-all duration-500 border-white/5">
        <div>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1.5 leading-none">{title}</p>
            <h4 className="text-3xl font-black text-white mb-2">{value}</h4>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${change.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>{change}</span>
                <span className="text-[10px] font-bold text-white/20 uppercase">Monthly</span>
            </div>
        </div>
        <div className={`p-4 bg-white/5 rounded-[1.25rem] ${color} group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
            {React.cloneElement(icon, { size: 32 })}
        </div>
    </div>
);

const SmallInfo = ({ label, value }: any) => (
    <div className="bg-white/2 border border-white/5 p-4 rounded-2xl">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{label}</p>
        <p className="font-black text-white">{value}</p>
    </div>
);

export default DashboardHome;
