import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useCategories, useProducts } from "@/lib/store";
import { motion } from "framer-motion";
import { Dumbbell, Zap, FlaskConical, Droplets, Flame, Pill, ShoppingBag, Milk } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "🥛": Milk,
  "💪": Dumbbell,
  "⚡": Zap,
  "🧪": FlaskConical,
  "💧": Droplets,
  "🔥": Flame,
  "💊": Pill,
  "🎒": ShoppingBag,
};

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "Categories — Protein Planet" },
      { name: "description", content: "Shop supplements by category: whey, mass gainers, creatine, BCAA and more." },
    ],
  }),
});

function CategoriesPage() {
  const { data: cats = [] } = useCategories();
  const { data: products = [] } = useProducts();
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Shop by goal</div>
          <h1 className="mt-1 font-display text-4xl font-black">All Categories</h1>
        </motion.div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cats.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-border bg-gradient-card p-4 text-center transition hover:border-neon/50 hover:shadow-neon"
                >
                  {c.image_url ? (
                    <img src={c.image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 transition group-hover:opacity-40" />
                  ) : null}
                  {(() => {
                    const IconComponent = ICON_MAP[c.icon] || Dumbbell;
                    return (
                      <div className="relative z-10 text-neon transition-transform group-hover:scale-125">
                        <IconComponent className="h-10 w-10" />
                      </div>
                    );
                  })()}
                  <div className="relative z-10 font-display text-base font-bold">{c.name}</div>
                  <div className="relative z-10 text-xs text-muted-foreground">{count} products</div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
