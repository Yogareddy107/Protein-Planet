import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useCategories, useProducts } from "@/lib/store";
import { motion } from "framer-motion";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => {
    const formattedCategory = params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${formattedCategory} — Premium Supplements | Protein Planet` },
        { name: "description", content: `Buy authentic, lab-tested premium ${formattedCategory} supplements online at Protein Planet. Fast shipping across India.` },
      ],
    };
  },
});

function CategoryPage() {
  const { slug } = useParams({ from: "/category/$slug" });
  const { data: cats = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts();
  const cat = cats.find((c) => c.slug === slug);
  const list = products.filter((p) => p.category === slug);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Category</div>
          <h1 className="mt-1 font-display text-4xl font-black">
            {cat ? `${cat.icon} ${cat.name}` : slug}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{list.length} products</p>
        </motion.div>
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading…</div>
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-border bg-gradient-card p-12 text-center text-muted-foreground">
            No products in this category yet.
            <div className="mt-4">
              <Link to="/products" className="text-neon">Browse all products</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
