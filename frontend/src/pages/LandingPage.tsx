import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, ShieldCheck, CloudSun, TrendingUp, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="relative min-h-screen overflow-hidden text-white">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-huge-green-field-4113-large.mp4" type="video/mp4" />
            </video>

            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-bg-dark/90 z-1" />

            {/* Navigation */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 text-2xl font-bold text-primary-light">
                    <Sprout size={32} />
                    <span>AgroSmart <span className="text-white">AI</span></span>
                </div>
                <div className="flex gap-6 items-center">
                    <Link to="/login" className="text-white font-medium hover:text-primary-light transition-colors">Login</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-8xl font-black mb-6 leading-tight"
                    >
                        AI-Powered Intelligence <br />
                        <span className="text-primary-light">for Modern Agriculture</span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Empowering farmers with real-time advisory, disease detection,
                        and a direct marketplace to maximize profit and efficiency.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/register" className="btn-primary text-xl px-10 py-5">
                            Empower My Farm
                        </Link>
                        <Link to="/marketplace" className="btn-secondary text-xl px-10 py-5 flex items-center gap-2">
                            <ShoppingCart size={24} />
                            Visit Marketplace
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Features Preview */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32"
                >
                    <FeatureCard
                        icon={<ShieldCheck className="text-primary-light" size={32} />}
                        title="Disease Detection"
                        description="Instant plant disease identification using computer vision and TensorFlow AI."
                    />
                    <FeatureCard
                        icon={<CloudSun className="text-primary-light" size={32} />}
                        title="Weather Advisory"
                        description="Smart irrigation and planting schedules based on hyper-local weather data."
                    />
                    <FeatureCard
                        icon={<TrendingUp className="text-primary-light" size={32} />}
                        title="Profit Estimator"
                        description="Data-driven yield predictions and market analysis for maximum revenue."
                    />
                </motion.div>
            </main>

            {/* Footer / Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10 text-white/50">
                <p className="text-sm font-medium uppercase tracking-widest">Scroll to explore</p>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="glass-card hover:bg-white/15 transition-all duration-300 group cursor-default">
        <div className="mb-4 bg-primary-dark/30 w-fit p-3 rounded-xl group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-white/60 leading-relaxed">{description}</p>
    </div>
);

export default LandingPage;
