import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Rahul Sharma",
    title: "Powerlifter",
    text: "The Gold Standard Whey mixes like a dream and the taste is legit. Gained 4kg lean mass in 8 weeks.",
    rating: 5,
  },
  {
    name: "Ananya Kapoor",
    title: "CrossFit athlete",
    text: "BCAA and pre-workout combo is unreal. Zero jitters, pure focus. My go-to store now.",
    rating: 5,
  },
  {
    name: "Vikram Iyer",
    title: "Bodybuilder",
    text: "Delivery in 2 days, sealed packaging, real batch codes. This is how a supplement store should be.",
    rating: 5,
  },
];

export function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Testimonials</div>
        <h2 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
          What our athletes say
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-6"
          >
            <Quote className="absolute right-4 top-4 h-10 w-10 text-neon/20" />
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{r.text}"</p>
            <div className="mt-6">
              <div className="font-display text-sm font-bold">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
