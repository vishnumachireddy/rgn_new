import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sprout,
    Thermometer,
    Droplets,
    Search,
    TrendingUp,
    CheckCircle2,
    Waves,
    Wind,
    Loader2,
    Zap,
    AlertTriangle,
    MapPin,
    CloudRain
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const CropRecommendation = () => {
    const [loading, setLoading] = useState(false);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<any | null>(null);
    const [autoEstimate, setAutoEstimate] = useState(true);
    const [fertilityScore, setFertilityScore] = useState<number | null>(null);
    const [phPrediction, setPhPrediction] = useState<any | null>(null);

    const [params, setParams] = useState({
        soil_type: 'Clay',
        nitrogen: 90,
        phosphorus: 42,
        potassium: 43,
        temperature: 28,
        humidity: 80,
        ph: 6.5,
        rainfall: 200,
        season: 'Kharif',
        state: '',
        district: '',
        mandal: ''
    });

    const [locations, setLocations] = useState({
        states: [] as string[],
        districts: [] as string[],
        mandals: [] as string[]
    });

    // Initial load: States
    useEffect(() => {
        fetchStates();
    }, []);

    // Trigger NPK update on soil/auto toggle
    useEffect(() => {
        if (autoEstimate && params.soil_type) {
            handleAutoNPK();
        }
    }, [params.soil_type, autoEstimate]);

    // Trigger pH prediction on any feature change
    useEffect(() => {
        if (autoEstimate) {
            handleAutoPH();
        }
    }, [params.soil_type, params.nitrogen, params.phosphorus, params.potassium, params.temperature, params.humidity, params.rainfall]);

    const fetchStates = async () => {
        try {
            const res = await axios.get(`${API_BASE}/locations/states`);
            setLocations(prev => ({ ...prev, states: res.data }));
        } catch (err) { console.error("States fetch failed"); }
    };

    const handleStateChange = async (state: string) => {
        setParams({ ...params, state, district: '', mandal: '' });
        try {
            const res = await axios.get(`${API_BASE}/locations/districts?state=${state}`);
            setLocations(prev => ({ ...prev, districts: res.data, mandals: [] }));
        } catch (err) { console.error("Districts fetch failed"); }
    };

    const handleDistrictChange = async (district: string) => {
        setParams({ ...params, district, mandal: '' });
        try {
            const res = await axios.get(`${API_BASE}/locations/mandals?district=${district}`);
            setLocations(prev => ({ ...prev, mandals: res.data }));
        } catch (err) { console.error("Mandals fetch failed"); }
    };

    const handleMandalChange = async (mandal: string) => {
        setParams({ ...params, mandal });
        fetchWeatherData(mandal);
    };

    const fetchWeatherData = async (mandal: string) => {
        setWeatherLoading(true);
        try {
            // Mock Coordinates for Demo Mandals
            const coordMap: any = {
                "Anantapur": { lat: 14.68, lon: 77.60 },
                "Hyderabad": { lat: 17.38, lon: 78.48 },
                "Nalgonda": { lat: 17.05, lon: 79.26 },
                "Warangal": { lat: 17.96, lon: 79.59 },
                "Visakhapatnam": { lat: 17.68, lon: 83.21 },
                "Gajuwaka": { lat: 17.69, lon: 83.21 },
                "Charminar": { lat: 17.36, lon: 78.47 }
            };
            const coords = coordMap[mandal] || { lat: 17.38 + Math.random(), lon: 78.48 + Math.random() };

            const res = await axios.get(`${API_BASE}/weather/advisory?lat=${coords.lat}&lon=${coords.lon}`);

            if (!res.data.error) {
                setParams(prev => ({
                    ...prev,
                    temperature: parseFloat(res.data.temp),
                    humidity: parseFloat(res.data.humidity),
                    rainfall: res.data.rainfall || 120 // Fallback if API doesn't provide mm
                }));
            }
        } catch (err) {
            console.error("Weather fetch failed");
        } finally {
            setWeatherLoading(false);
        }
    };

    const handleAutoNPK = async () => {
        try {
            const res = await axios.post(`${API_BASE}/ai/predict-npk`, { soil_type: params.soil_type });
            setParams(prev => ({
                ...prev,
                nitrogen: res.data.nitrogen,
                phosphorus: res.data.phosphorus,
                potassium: res.data.potassium
            }));
            setFertilityScore(res.data.fertility_score);
        } catch (err) { console.error("NPK prediction failed"); }
    };

    const handleAutoPH = async () => {
        try {
            const res = await axios.post(`${API_BASE}/ai/predict-ph`, {
                soil_type: params.soil_type,
                nitrogen: params.nitrogen,
                phosphorus: params.phosphorus,
                potassium: params.potassium,
                rainfall: params.rainfall,
                temperature: params.temperature,
                humidity: params.humidity
            });
            setPhPrediction(res.data);
            setParams(prev => ({ ...prev, ph: res.data.predicted_ph }));
        } catch (err) { console.error("PH prediction failed"); }
    };

    const handlePredict = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/ai/recommend-crop`, params);
            setRecommendation(res.data);

            // Save to database (mock)
            await axios.post(`${API_BASE}/ai/save-prediction`, params);
        } catch (err: any) {
            alert(err.response?.data?.detail || "Inference failed.");
        } finally {
            setLoading(false);
        }
    };

    const getFertilityInfo = (score: number | null) => {
        if (!score) return { label: 'Unknown', color: 'text-white/20', bg: 'bg-white/5' };
        if (score > 70) return { label: 'High Fertility', color: 'text-green-400', bg: 'bg-green-500/10' };
        if (score > 40) return { label: 'Medium Fertility', color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
        return { label: 'Low Fertility', color: 'text-red-400', bg: 'bg-red-500/10' };
    };

    const fertility = getFertilityInfo(fertilityScore);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="text-left mb-10">
                <motion.h1
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-4xl font-black mb-4 flex items-center gap-3"
                >
                    <Sprout className="text-primary-light" size={40} />
                    AgroSmart <span className="text-primary-light">Soil Intelligence</span>
                </motion.h1>
                <p className="text-white/60 text-lg">Real-time weather integration & AI-powered Environmental Modeling for precision farming.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Panel */}
                <div className="glass-card h-fit space-y-6 border-white/5">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <MapPin size={20} className="text-primary-light" />
                            Location & Climate
                        </h3>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                            {weatherLoading ? <Loader2 size={14} className="animate-spin text-primary-light" /> : <Zap size={14} className={autoEstimate ? "text-primary-light" : "text-white/20"} />}
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">AI-Sync</span>
                            <button
                                onClick={() => setAutoEstimate(!autoEstimate)}
                                className={`w-8 h-4 rounded-full relative transition-colors ${autoEstimate ? "bg-primary" : "bg-white/10"}`}
                            >
                                <motion.div
                                    animate={{ x: autoEstimate ? 16 : 2 }}
                                    className="absolute top-1 w-2 h-2 bg-white rounded-full shadow-lg"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Location Selectors */}
                        <div className="grid grid-cols-3 gap-2">
                            <SelectGroup label="State" value={params.state} onChange={handleStateChange} options={locations.states} />
                            <SelectGroup label="District" value={params.district} onChange={handleDistrictChange} options={locations.districts} />
                            <SelectGroup label="Mandal" value={params.mandal} onChange={handleMandalChange} options={locations.mandals} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <SelectGroup label="Soil Type" value={params.soil_type} onChange={(v: any) => setParams({ ...params, soil_type: v })} options={['Clay', 'Sandy', 'Black', 'Red', 'Loamy']} />
                            <SelectGroup label="Season" value={params.season} onChange={(v: any) => setParams({ ...params, season: v })} options={['Kharif', 'Rabi', 'Zaid']} />
                        </div>

                        {/* NPK Row */}
                        <div className="relative">
                            <div className="grid grid-cols-3 gap-3">
                                <SmallInput label="N" value={params.nitrogen} onChange={(v: any) => setParams({ ...params, nitrogen: v })} disabled={autoEstimate} />
                                <SmallInput label="P" value={params.phosphorus} onChange={(v: any) => setParams({ ...params, phosphorus: v })} disabled={autoEstimate} />
                                <SmallInput label="K" value={params.potassium} onChange={(v: any) => setParams({ ...params, potassium: v })} disabled={autoEstimate} />
                            </div>
                            {autoEstimate && (
                                <div className={`mt-3 px-4 py-2 rounded-xl border border-white/5 flex items-center justify-between ${fertility.bg}`}>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle size={14} className={fertility.color} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${fertility.color}`}>{fertility.label}</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{fertilityScore}%</span>
                                </div>
                            )}
                        </div>

                        {/* Weather Row */}
                        <div className="grid grid-cols-3 gap-3">
                            <InputGroup label="Temp (°C)" icon={<Thermometer size={14} />} value={params.temperature} onChange={(e: any) => setParams({ ...params, temperature: parseFloat(e.target.value) })} disabled={autoEstimate && weatherLoading} />
                            <InputGroup label="Humid (%)" icon={<Droplets size={14} />} value={params.humidity} onChange={(e: any) => setParams({ ...params, humidity: parseFloat(e.target.value) })} disabled={autoEstimate && weatherLoading} />
                            <InputGroup label="Rain (mm)" icon={<CloudRain size={14} />} value={params.rainfall} onChange={(e: any) => setParams({ ...params, rainfall: parseFloat(e.target.value) })} disabled={autoEstimate && weatherLoading} />
                        </div>

                        {/* pH Row with AI Estimate */}
                        <div className="relative">
                            <InputGroup label="Soil pH Value" icon={<Waves size={18} />} value={params.ph} onChange={(e: any) => setParams({ ...params, ph: parseFloat(e.target.value) })} disabled={autoEstimate} />
                            {autoEstimate && phPrediction && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="absolute right-3 top-9 flex items-center gap-1.5 bg-primary/20 px-2 py-1 rounded-lg border border-primary/30"
                                >
                                    <Zap size={10} className="text-primary-light" />
                                    <span className="text-[8px] font-black text-primary-light uppercase">AI Estimated</span>
                                </motion.div>
                            )}
                        </div>

                        {autoEstimate && phPrediction && (
                            <p className="text-[10px] font-bold text-primary-light italic ml-1">
                                Recommendation: {phPrediction.recommendation}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={loading || weatherLoading}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 mt-4 text-lg font-black uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <TrendingUp size={20} />}
                        {loading ? 'Analyzing Soil...' : 'Run Intelligence'}
                    </button>

                    {autoEstimate && (
                        <p className="text-[10px] text-white/20 text-center uppercase font-bold tracking-widest">
                            * pH & NPK Estimated using RandomForest Regression
                        </p>
                    )}
                </div>

                {/* Results */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {recommendation ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full"
                            >
                                <div className="glass-card border-primary/30 h-full flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Sprout size={200} />
                                    </div>

                                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary-light mb-8">
                                        <CheckCircle2 size={64} />
                                    </div>

                                    <p className="text-white/40 font-black uppercase tracking-[0.3em] mb-2">Optimal Selection</p>
                                    <h2 className="text-7xl font-black text-white mb-6 drop-shadow-lg">{recommendation.recommended_crop}</h2>

                                    <div className="inline-flex items-center gap-2 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 mb-6">
                                        <span className="text-white/60 font-bold uppercase text-sm">Engine Confidence:</span>
                                        <span className="text-primary-light font-black text-2xl">{recommendation.confidence_score}%</span>
                                    </div>

                                    {recommendation.ai_insight && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-primary/5 border border-primary/20 p-8 rounded-[2.5rem] mb-8 text-left relative overflow-hidden max-w-2xl"
                                        >
                                            <div className="flex items-center gap-2 mb-4 text-primary-light font-black uppercase text-[10px] tracking-[0.2em]">
                                                <TrendingUp size={16} />
                                                Precision Advisory (Groq Llama-3.3)
                                            </div>
                                            <p className="text-white/80 leading-relaxed italic text-base">"{recommendation.ai_insight}"</p>
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                                        <ResultBadge label="Soil Acidity" value={params.ph < 6 ? "Acidic" : params.ph > 7.5 ? "Alkaline" : "Neutral"} />
                                        <ResultBadge label="Nutrients" value={fertilityScore && fertilityScore > 60 ? "Rich" : "Average"} />
                                        <ResultBadge label="Profit Potential" value="High" />
                                    </div>

                                    <button
                                        onClick={() => setRecommendation(null)}
                                        className="mt-12 text-white/30 hover:text-white font-bold text-xs uppercase tracking-[0.3em] border-b border-transparent hover:border-white/30 pb-1"
                                    >
                                        ← New Analysis
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-center bg-white/1 min-h-[600px]">
                                <div className="p-8 bg-white/5 rounded-[2.5rem] mb-8">
                                    <Waves size={80} className="text-white/10" />
                                </div>
                                <h3 className="text-2xl font-black text-white/40 uppercase tracking-[0.3em] mb-4">Intelligence Idle</h3>
                                <p className="text-white/20 max-w-sm font-medium">Select your location and soil profile to trigger the environmental intelligence engine.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, icon, disabled, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                {icon}
            </div>
            <input
                {...props}
                type="number"
                disabled={disabled}
                className={`w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all text-white font-bold ${disabled ? "opacity-40" : ""}`}
            />
        </div>
    </div>
);

const SelectGroup = ({ label, options, value, onChange }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 outline-none focus:border-primary text-white appearance-none cursor-pointer font-bold text-[10px]"
        >
            <option value="" className="bg-bg-dark text-white/30 italic">-- {label} --</option>
            {options.map((o: any) => <option key={o} value={o} className="bg-bg-dark">{o}</option>)}
        </select>
    </div>
);

const SmallInput = ({ label, value, onChange, disabled }: any) => (
    <div className="space-y-2 text-center group">
        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-primary-light transition-colors">{label}</label>
        <input
            type="number"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 text-center text-sm font-black focus:border-primary outline-none transition-all ${disabled ? "opacity-50 cursor-not-allowed bg-white/2" : ""}`}
        />
    </div>
);

const ResultBadge = ({ label, value }: any) => (
    <div className="bg-white/2 p-5 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="font-black text-white text-lg">{value}</p>
    </div>
);

export default CropRecommendation;
