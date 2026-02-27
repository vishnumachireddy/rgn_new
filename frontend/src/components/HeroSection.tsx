import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Bug, Sprout, CloudSun, BarChart3, MessageSquare, Leaf } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import heroVideo from "@/assets/hero-video.mp4";

/* ───── Animated Counter Hook ───── */
const useCountUp = (end: number, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(start + (end - start) * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, start]);

  return { count, ref };
};

/* ───── Feature Orbit ───── */
const orbitFeatures = [
  { icon: Bug, label: "Disease Detection" },
  { icon: Sprout, label: "Crop Recommendation" },
  { icon: CloudSun, label: "Weather Intelligence" },
  { icon: BarChart3, label: "Analytics" },
  { icon: MessageSquare, label: "AI Chat" },
];

const FeatureOrbit = () => {
  const radius = 180;
  return (
    <div className="relative mx-auto h-[460px] w-[460px] max-w-full">
      {/* Orbit rings */}
      <div className="absolute inset-[30px] rounded-full border border-border/30" />
      <div className="absolute inset-[60px] rounded-full border border-border/15" />

      {/* Center circle */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full glass-strong"
      >
        <div className="text-center">
          <Leaf className="mx-auto h-8 w-8 text-secondary" />
          <p className="mt-1 font-display text-xs font-bold text-foreground">AgroSmart</p>
          <p className="font-display text-[10px] font-semibold text-accent">AI</p>
        </div>
      </motion.div>

      {/* Orbiting features */}
      {orbitFeatures.map((feature, i) => {
        const angle = (i / orbitFeatures.length) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.15 }}
            className="absolute flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl glass transition-all duration-300 hover:border-secondary/40"
            style={{
              left: `calc(50% + ${x}px - 40px)`,
              top: `calc(50% + ${y}px - 40px)`,
            }}
          >
            <div className="text-center">
              <feature.icon className="mx-auto h-5 w-5 text-secondary" />
              <p className="mt-1 font-body text-[9px] font-medium text-foreground leading-tight">{feature.label}</p>
            </div>
          </motion.div>
        );
      })}

      {/* Connecting lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 460 460">
        {orbitFeatures.map((_, i) => {
          const angle = (i / orbitFeatures.length) * 2 * Math.PI - Math.PI / 2;
          const x = 230 + Math.cos(angle) * radius;
          const y = 230 + Math.sin(angle) * radius;
          return (
            <motion.line
              key={i}
              x1="230" y1="230" x2={x} y2={y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.4 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

/* ───── Individual Stat Card (proper hook usage) ───── */
const StatCard = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { count, ref } = useCountUp(end, 2000);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 text-center"
    >
      <div className="font-display text-3xl font-bold text-secondary md:text-4xl">
        {end >= 1000 ? `${Math.floor(count / 1000)}K` : count}
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="mt-2 font-body text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

/* ───── Stats Section ───── */
const stats = [
  { end: 10000, suffix: "+", label: "Active Farmers" },
  { end: 95, suffix: "%", label: "Accuracy Rate" },
  { end: 50, suffix: "+", label: "Crop Varieties" },
  { end: 24, suffix: "/7", label: "AI Support" },
];

const StatsSection = () => (
  <section className="relative py-20">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} end={stat.end} suffix={stat.suffix} label={stat.label} />
        ))}
      </div>
    </div>
  </section>
);

/* ───── Hero Section ───── */
const HeroSection = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 -z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            poster={heroBg}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/75 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/80" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-[140px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 h-56 w-56 rounded-full bg-accent/8 blur-[120px] animate-float" style={{ animationDelay: "3s" }} />

        {/* Content */}
        <div className="container relative z-10 mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-5 py-2.5 backdrop-blur-lg"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="font-body text-sm font-medium text-secondary">Powered by Artificial Intelligence</span>
            </motion.div>

            <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
              <span className="text-foreground">Agro</span>
              <span className="text-secondary">Smart</span>{" "}
              <span className="gradient-text">AI</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              Intelligent Agriculture Platform Powered by AI. Detect diseases, predict yields, and revolutionize your farming practices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--secondary) / 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="agro-btn-primary flex items-center gap-2 rounded-xl px-8 py-4 font-display text-base font-semibold text-primary-foreground glow-primary"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              <Link to="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card/30 px-8 py-4 font-display text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:border-secondary/40 hover:bg-card/50"
                >
                  Explore Services
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Orbit Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[200px]" />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">
              Our <span className="gradient-text">Ecosystem</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg font-body text-muted-foreground">
              A complete suite of AI-powered tools working together for smarter agriculture.
            </p>
          </motion.div>
          <FeatureOrbit />
        </div>
      </section>

      {/* Stats */}
      <StatsSection />
    </>
  );
};

export default HeroSection;
