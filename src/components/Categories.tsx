import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCategories } from "@/lib/store";
import { Dumbbell, Zap, FlaskConical, Droplets, Flame, Pill, ShoppingBag, Milk, Wheat, Cookie } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "🥛": Milk,
  "💪": Dumbbell,
  "⚡": Zap,
  "🧪": FlaskConical,
  "💧": Droplets,
  "🔥": Flame,
  "💊": Pill,
  "🎒": ShoppingBag,
  "🌾": Wheat,
  "🥜": Cookie,
};

export function Categories() {
  const { data: cats = [] } = useCategories();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Shop by goal</div>
        <h2 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
          Categories
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {cats.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Link
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-3 text-center transition-all hover:border-neon/50 hover:shadow-neon"
            >
              {c.image_url ? (
                <img src={c.image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 transition group-hover:opacity-50" />
              ) : null}
              {(() => {
                const IconComponent = ICON_MAP[c.icon] || Dumbbell;
                return (
                  <div className="relative z-10 text-neon transition-transform group-hover:scale-125">
                    <IconComponent className="h-7 w-7" />
                  </div>
                );
              })()}
              <div className="relative z-10 text-xs font-bold leading-tight">{c.name}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
