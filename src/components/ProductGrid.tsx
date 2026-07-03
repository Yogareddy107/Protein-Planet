import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  title,
  eyebrow,
  products,
  cta,
}: {
  title: string;
  eyebrow?: string;
  products: Product[];
  cta?: { label: string; onClick?: () => void };
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {eyebrow && (
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-neon">{eyebrow}</div>
          )}
          <h2 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
            {title}
          </h2>
        </motion.div>
        {cta && (
          <button
            onClick={cta.onClick}
            className="hidden shrink-0 rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest hover:border-neon hover:text-neon sm:block"
          >
            {cta.label}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
