import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Thermometer, Droplets, Wind, CloudRain, Sun, AlertTriangle, Loader2, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const WeatherAdvisory = () => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeather();
    }, []);

    const fetchWeather = async () => {
        setLoading(true);
        try {
            // Default to Hyderabad coordinates, in production use navigator.geolocation
            const res = await axios.get('http://localhost:8000/api/weather/advisory?lat=17.3850&lon=78.4867');
            setWeather(res.data);
        } catch (err) {
            console.error("Weather fetch failed");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary-light" size={48} />
                <p className="font-black text-white/20 uppercase tracking-[0.4em]">Syncing with Satellites...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                        <CloudSun className="text-primary-light" size={40} />
                        Live Weather <span className="text-primary-light">Intelligence</span>
                    </h1>
                    <p className="text-white/60 text-lg flex items-center gap-2">
                        <MapPin size={18} className="text-primary" />
                        Real-time data for {weather?.city || 'Your Region'}
                    </p>
                </div>

                {weather?.temp > 35 && (
                    <div className="bg-orange-500/10 border border-orange-500/20 px-6 py-3 rounded-2xl flex items-center gap-3 animate-pulse">
                        <AlertTriangle className="text-orange-400" />
                        <div className="text-sm">
                            <p className="font-bold text-orange-400">Extreme Heat Alert</p>
                            <p className="text-white/40 text-xs">High evapotranspiration likely.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <WeatherCard icon={<Thermometer />} label="Temperature" value={`${weather?.temp}°C`} sub={weather?.condition} />
                <WeatherCard icon={<Droplets />} label="Humidity" value={`${weather?.humidity}%`} sub="Moisture Level" />
                <WeatherCard icon={<Wind />} label="Condition" value={weather?.condition} sub={weather?.description} />
                <WeatherCard icon={<CloudRain />} label="Rain Probability" value="Low" sub="Next 12 Hours" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Advanced AI Insight */}
                <div className="lg:col-span-2 glass-card border-primary/20 relative overflow-hidden flex flex-col justify-center p-12 shadow-2xl shadow-primary/5">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sun size={200} />
                    </div>
                    <div className="relative z-10 text-left">
                        <div className="flex items-center gap-2 text-primary-light font-black uppercase tracking-widest text-sm mb-4">
                            <Sun size={20} className="animate-spin-slow" />
                            LLM Weather Advisory (Groq)
                        </div>
                        <h2 className="text-3xl font-black text-white mb-6 leading-tight">
                            Smart Farming Action Protocol for {weather?.condition} conditions
                        </h2>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative">
                            <p className="text-xl text-white/80 leading-relaxed italic">
                                "{weather?.ai_advisory || "Stay alert for local micro-climate changes. Maintain consistent irrigation if topsoil feels dry."}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Tasks */}
                <div className="glass-card flex flex-col justify-between border-white/5">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <AlertTriangle size={24} className="text-accent" />
                        Recommended Tasks
                    </h3>
                    <div className="space-y-4">
                        <TaskItem label="Irrigation" status="Optimal" color="text-green-400" />
                        <TaskItem label="Fertilization" status="Avoid" color="text-red-400" />
                        <TaskItem label="Pesticide Spray" status="Caution" color="text-yellow-400" />
                        <TaskItem label="Equipment Check" status="Good" color="text-blue-400" />
                    </div>
                    <button onClick={fetchWeather} className="btn-primary w-full mt-8 py-4 text-sm font-black uppercase tracking-widest">
                        Sync Data
                    </button>
                </div>
            </div>
        </div>
    );
};

const WeatherCard = ({ icon, label, value, sub }: any) => (
    <div className="glass-card flex items-center gap-4 hover:border-primary-light/30 transition-all group">
        <div className="p-4 bg-white/5 rounded-2xl text-primary-light group-hover:scale-110 transition-transform shadow-lg">
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-[10px] font-bold text-primary-light/60 uppercase tracking-widest">{sub}</p>
        </div>
    </div>
);

const TaskItem = ({ label, status, color }: any) => (
    <div className="flex justify-between items-center bg-white/2 p-4 rounded-2xl border border-white/5 group hover:bg-white/5 transition-colors">
        <span className="text-sm font-bold text-white/60">{label}</span>
        <span className={`text-xs font-black uppercase tracking-widest ${color}`}>{status}</span>
    </div>
);

export default WeatherAdvisory;
