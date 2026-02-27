import { motion } from "framer-motion";
import { Bug, Sprout, BarChart3, MessageSquare } from "lucide-react";

const services = [
  {
    icon: Bug,
    title: "Disease Detection",
    description: "AI-powered crop disease identification from images with instant treatment recommendations.",
  },
  {
    icon: Sprout,
    title: "Crop Recommendation",
    description: "Smart suggestions for optimal crops based on soil, weather, and market conditions.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Real-time dashboards with yield predictions, weather patterns, and market insights.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "24/7 intelligent farming assistant for queries about crops, weather, and best practices.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const ServicesSection = () => {
  return (
    <section className="relative py-24">
      <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-[150px]" />

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-muted-foreground">
            Empowering farmers with cutting-edge AI tools for smarter, more sustainable agriculture.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass group cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:border-secondary/30"
            >
              <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-secondary transition-colors group-hover:bg-primary/20">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{service.title}</h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
