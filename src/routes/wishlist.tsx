import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/lib/store";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({ meta: [{ title: "Wishlist — Protein Planet" }] }),
});

function WishlistPage() {
  const { wishlist } = useCart();
  const { data: products = [] } = useProducts();
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-black">Your Wishlist</h1>
        {items.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-border bg-gradient-card p-12 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="font-display text-lg font-bold">No favorites yet</div>
            <Link to="/products" className="rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-gold">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
