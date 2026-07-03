import { motion } from "framer-motion";
import { ShieldCheck, Truck, Award, HeartPulse } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, title: "100% Authentic", desc: "Every batch lab tested for purity and potency." },
  { icon: Truck, title: "Fast Shipping", desc: "Dispatched within 24 hours across India." },
  { icon: Award, title: "Premium Brands", desc: "Top international supplement brands only." },
  { icon: HeartPulse, title: "Expert Support", desc: "Free nutrition advice from certified experts." },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Why ProteinX</div>
          <h2 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
            Built for <span className="text-gradient-gold">Serious Athletes</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-6 transition hover:border-neon/40"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-primary-foreground shadow-gold transition-transform group-hover:rotate-6">
                <f.icon className="h-6 w-6" />
              </div>
              <div className="font-display text-lg font-bold">{f.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
