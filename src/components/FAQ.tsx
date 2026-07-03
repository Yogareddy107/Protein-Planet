import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Are your products 100% authentic?",
    a: "Yes. Every product is sourced directly from the brand or authorized importer with full batch traceability and lab reports.",
  },
  {
    q: "How fast is the shipping?",
    a: "Orders placed before 5PM ship the same day. Metro delivery in 1-2 days, rest of India 3-5 days.",
  },
  {
    q: "Do you accept returns?",
    a: "Sealed products can be returned within 7 days. Opened supplements are non-returnable for hygiene reasons.",
  },
  {
    q: "Which flavour should I pick?",
    a: "Chocolate and vanilla are safest. Try the smaller pack first if you're unsure — we always recommend starting small.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Help</div>
        <h2 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
          Frequently Asked
        </h2>
      </motion.div>
      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-card"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-base font-bold">{f.q}</span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-elevated text-neon">
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
