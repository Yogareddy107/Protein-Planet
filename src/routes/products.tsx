import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useCategories, useProducts } from "@/lib/store";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "All Products — Protein Planet" },
      { name: "description", content: "Browse premium whey, mass gainers, creatine, BCAA and more." },
    ],
  }),
});

function ProductsPage() {
  const { data: products = [] } = useProducts();
  const { data: cats = [] } = useCategories();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<string>("featured");

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      (cat === "all" || p.category === cat) &&
      (q === "" || `${p.name} ${p.brand} ${p.flavor}`.toLowerCase().includes(q.toLowerCase())),
    );
    switch (sort) {
      case "low": list = [...list].sort((a, b) => a.price - b.price); break;
      case "high": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "new": list = [...list].sort((a, b) => Number(b.badges.includes("new")) - Number(a.badges.includes("new"))); break;
    }
    return list;
  }, [products, q, cat, sort]);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Shop</div>
          <h1 className="mt-1 font-display text-4xl font-black">All Products</h1>
        </motion.div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, brands, flavors..."
              className="w-full rounded-full border border-border bg-surface pl-10 pr-4 py-3 text-sm outline-none focus:border-neon"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-neon"
            >
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>All</Chip>
          {cats.map((c) => (
            <Chip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
              {c.icon} {c.name}
            </Chip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-gradient-card p-12 text-center text-muted-foreground">
            No products match your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
        active
          ? "border-neon bg-neon/10 text-neon"
          : "border-border bg-surface text-muted-foreground hover:border-neon hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
