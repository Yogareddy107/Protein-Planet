import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/store";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/offers")({
  component: OffersPage,
  head: () => ({
    meta: [
      { title: "Offers — Protein Planet" },
      { name: "description", content: "Limited time offers on premium supplements." },
    ],
  }),
});

function OffersPage() {
  const { data: products = [] } = useProducts();
  const offers = products.filter((p) => p.badges.includes("offer"));
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neon">
            <Flame className="h-4 w-4" /> Limited time
          </div>
          <h1 className="mt-1 font-display text-4xl font-black">Hot Offers</h1>
        </motion.div>
        {offers.length === 0 ? (
          <div className="rounded-2xl border border-border bg-gradient-card p-12 text-center text-muted-foreground">
            No offers right now. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {offers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
