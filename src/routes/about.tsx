import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Truck, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us — Protein Planet" },
      { name: "description", content: "Premium supplements engineered for serious athletes. Learn about Protein Planet." },
    ],
  }),
});

function AboutPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Our story</div>
          <h1 className="mt-1 font-display text-4xl font-black sm:text-5xl">
            Fuelling <span className="text-gradient-gold">India's Athletes</span>
          </h1>
          <p className="mt-5 text-base text-muted-foreground">
            Protein Planet was built by athletes for athletes. We handpick every product, verify batch codes,
            and ship only what we'd take ourselves. Zero counterfeits. Zero shortcuts.
          </p>
        </motion.div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Users, k: "50K+", v: "Happy athletes" },
            { icon: Award, k: "100+", v: "Premium SKUs" },
            { icon: ShieldCheck, k: "100%", v: "Authentic" },
            { icon: Truck, k: "24h", v: "Dispatch" },
          ].map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-gradient-card p-5"
            >
              <s.icon className="h-6 w-6 text-neon" />
              <div className="mt-3 font-display text-2xl font-black">{s.k}</div>
              <div className="text-xs text-muted-foreground">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
