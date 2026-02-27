import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, User, Tractor, ShoppingBag, ArrowRight, ShieldCheck, LandPlot, Wheat, Lock, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const RegisterPage = () => {
    const [role] = useState<'farmer'>('farmer');
    const [step] = useState(2);
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        state: '',
        district: '',
        mandal: '',
        landSize: '',
        primaryCrop: 'Rice',
        adminKey: '',
    });

    const [locations, setLocations] = useState({
        states: [] as string[],
        districts: [] as string[],
        mandals: [] as string[],
    });

    const [errors, setErrors] = useState({
        password: '',
        admin: '',
        general: '',
    });

    const navigate = useNavigate();

    // Fetch States on role selection
    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        setLocLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/locations/states`);
            setLocations(prev => ({ ...prev, states: res.data }));
        } catch (err) {
            console.error("Failed to fetch states");
        } finally {
            setLocLoading(false);
        }
    };

    const handleStateChange = async (state: string) => {
        setFormData({ ...formData, state, district: '', mandal: '' });
        setLocLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/locations/districts?state=${state}`);
            setLocations(prev => ({ ...prev, districts: res.data, mandals: [] }));
        } catch (err) {
            console.error("Failed to fetch districts");
        } finally {
            setLocLoading(false);
        }
    };

    const handleDistrictChange = async (district: string) => {
        setFormData({ ...formData, district, mandal: '' });
        setLocLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/locations/mandals?state=${formData.state}&district=${district}`);
            setLocations(prev => ({ ...prev, mandals: res.data }));
        } catch (err) {
            console.error("Failed to fetch mandals");
        } finally {
            setLocLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({ ...errors, password: '', admin: '', general: '' });

        if (formData.password !== formData.confirmPassword) {
            setErrors(prev => ({ ...prev, password: "Passwords do not match!" }));
            return;
        }

        if (formData.password.length < 6) {
            setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
            return;
        }

        setLoading(true);
        try {
            // Prepare payload
            const payload = {
                ...formData,
                role: role,
                landSize: formData.landSize ? parseFloat(formData.landSize) : null
            };

            const res = await axios.post(`${API_BASE}/auth/signup`, payload);
            alert(`Registration Successful! Your generated ID is: ${res.data.temp_id}`);
            navigate('/login');
        } catch (err: any) {
            console.error("Signup Error:", err.response?.data);
            if (err.response?.status === 403) {
                setErrors(prev => ({ ...prev, admin: "Invalid Admin Secret Key!" }));
            } else if (err.response?.status === 422) {
                setErrors(prev => ({ ...prev, general: "Please check all fields. Some information is missing or invalid." }));
            } else {
                const detail = err.response?.data?.detail;
                const errorMsg = typeof detail === 'string' ? detail : "Signup failed. Please try again.";
                setErrors(prev => ({ ...prev, general: errorMsg }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-2xl z-10 p-8 md:p-12"
            >
                <div className="text-center mb-10">
                    <div className="flex justify-center items-center gap-3 text-3xl font-black text-primary-light mb-4">
                        <Sprout size={48} />
                        <span>AgroSmart <span className="text-white">AI</span></span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Join the Ecosystem</h2>
                    <p className="text-white/50">Setup your account in seconds.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Details */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary-light/60 ml-1">Identity</h3>
                            <InputGroup
                                label="Full Name"
                                icon={<User size={18} />}
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e: any) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                            <InputGroup
                                label="Phone Number"
                                icon={<User size={18} />}
                                placeholder="+91 00000 00000"
                                value={formData.phone}
                                onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        {/* Passwords */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary-light/60 ml-1">Security</h3>
                            <InputGroup
                                label="Password"
                                type="password"
                                icon={<Lock size={18} />}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <InputGroup
                                label="Confirm Password"
                                type="password"
                                icon={<Lock size={18} />}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary-light/60 ml-1">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SelectGroup
                                label="State"
                                value={formData.state}
                                onChange={(e: any) => handleStateChange(e.target.value)}
                                options={locations.states}
                                loading={locLoading}
                            />
                            <SelectGroup
                                label="District"
                                value={formData.district}
                                onChange={(e: any) => handleDistrictChange(e.target.value)}
                                options={locations.districts}
                                loading={locLoading}
                                disabled={!formData.state}
                            />
                            <SelectGroup
                                label="Mandal"
                                value={formData.mandal}
                                onChange={(e: any) => setFormData({ ...formData, mandal: e.target.value })}
                                options={locations.mandals}
                                loading={locLoading}
                                disabled={!formData.district}
                            />
                        </div>
                    </div>

                    {/* Farmer Specific */}
                    <div className="space-y-4 border-t border-white/5 pt-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-primary-light/60 ml-1">Farm Data</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup
                                label="Land Size (Acres)"
                                type="number"
                                icon={<LandPlot size={18} />}
                                placeholder="5.0"
                                value={formData.landSize}
                                onChange={(e: any) => setFormData({ ...formData, landSize: e.target.value })}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70 ml-1 flex items-center gap-2">
                                    <Wheat size={16} /> Primary Crop
                                </label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none cursor-pointer"
                                    value={formData.primaryCrop}
                                    onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                                >
                                    <option value="Rice" className="bg-bg-dark">Rice</option>
                                    <option value="Cotton" className="bg-bg-dark">Cotton</option>
                                    <option value="Maize" className="bg-bg-dark">Maize</option>
                                    <option value="Wheat" className="bg-bg-dark">Wheat</option>
                                    <option value="Groundnut" className="bg-bg-dark">Groundnut</option>
                                    <option value="Soybean" className="bg-bg-dark">Soybean</option>
                                    <option value="Sugarcane" className="bg-bg-dark">Sugarcane</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {errors.general && <p className="text-sm text-red-500 text-center">{errors.general}</p>}

                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
                            Generate My Farmer ID
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-white/40 text-sm">
                    Already part of our network? <Link to="/login" className="text-primary-light font-black hover:underline ml-1">LOGIN NOW</Link>
                </p>
            </motion.div>
        </div>
    );
};


const InputGroup = ({ label, icon, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-white/70 ml-1 flex items-center gap-2">
            {icon} {label}
        </label>
        <input
            {...props}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white placeholder:text-white/10"
        />
    </div>
);

const SelectGroup = ({ label, options, loading, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-xs font-black text-white/30 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <select
                {...props}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-white appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <option value="" className="bg-bg-dark text-white/20">Select {label}</option>
                {options.map((opt: string) => (
                    <option key={opt} value={opt} className="bg-bg-dark">{opt}</option>
                ))}
            </select>
            {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="animate-spin text-primary-light" size={16} />
                </div>
            )}
        </div>
    </div>
);

export default RegisterPage;
