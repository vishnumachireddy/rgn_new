import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Smartphone, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const LoginPage = () => {
    const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
    const [role] = useState<'farmer'>('farmer');
    const [formData, setFormData] = useState({ idOrPhone: '', password: '' });
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginInit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/auth/login/initiate`, {
                loginIdOrPhone: formData.idOrPhone,
                password: formData.password,
                role: role
            });
            setGeneratedOtp(res.data.otp_preview);
            setStep(2);
            setTimer(30);
        } catch (err: any) {
            alert(err.response?.data?.detail || "Invalid credentials. Please check your ID/Phone and Role.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/auth/login/verify`, {
                loginIdOrPhone: formData.idOrPhone,
                otp: otp
            });

            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Navigate based on role from token
            navigate(`/dashboard/${res.data.user.role}`);
        } catch (err) {
            alert("Invalid OTP code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval: any;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4"
                    >
                        <Sprout className="text-primary-light" size={40} />
                    </motion.div>
                    <h1 className="text-4xl font-black mb-2">AgroSmart <span className="text-primary-light">AI</span></h1>
                    <p className="text-white/40">Secure access to your agricultural dashboard</p>
                </div>

                <div className="glass-card p-8 border-white/5 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleLoginInit}
                                className="space-y-6"
                            >
                                {/* Role Selection Removed - Farmer Only */}
                                <div className="hidden">
                                    <input type="hidden" value="farmer" />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/40 uppercase tracking-widest ml-1">ID or Phone Number</label>
                                        <input
                                            required
                                            value={formData.idOrPhone}
                                            onChange={(e) => setFormData({ ...formData, idOrPhone: e.target.value })}
                                            placeholder="FRM10001 or 9988776655"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
                                        <input
                                            required
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all text-white"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Verify Credentials"}
                                    {!loading && <ArrowRight size={20} />}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyOtp}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <div className="inline-flex p-4 bg-accent/10 rounded-full mb-4 text-accent">
                                        <Smartphone size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Verify OTP</h3>
                                    <p className="text-white/40 text-sm">We've generated a secure code for you:</p>
                                    <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                                        <span className="text-3xl font-black tracking-[0.5em] text-primary-light">{generatedOtp}</span>
                                    </div>
                                </div>

                                <input
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-5 text-center text-3xl font-black tracking-[0.2em] focus:outline-none focus:border-accent transition-all"
                                />

                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-accent hover:bg-accent/80 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-accent/20"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Secure Login"}
                                        {!loading && <ShieldCheck size={20} />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-white/40 text-sm font-bold w-full hover:text-white transition-colors"
                                    >
                                        Back to Credentials
                                    </button>
                                </div>

                                <p className="text-center text-xs text-white/20">
                                    Resend code in <span className="text-white/40 font-bold">{timer}s</span>
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-center mt-8 text-white/40 font-medium">
                    New to AgroSmart? <Link to="/register" className="text-primary-light hover:underline ml-1">Create an account</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
