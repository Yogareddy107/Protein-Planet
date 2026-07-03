import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductGrid } from "@/components/ProductGrid";
import { useProduct, useProducts } from "@/lib/store";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingBag, Heart, Zap, ArrowLeft, Share2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  head: ({ params }) => {
    const formattedTitle = params.id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${formattedTitle} — Buy Online | Protein Planet` },
        { name: "description", content: `Get 100% authentic ${formattedTitle} on Protein Planet. Premium supplements, lab-tested, with fast delivery.` },
      ],
    };
  },
});

function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts = [] } = useProducts();
  const { add, toggleWishlist, wishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "nutri" | "usage">("desc");

  if (isLoading) {
    return <Layout><div className="p-20 text-center text-muted-foreground">Loading…</div></Layout>;
  }
  if (!product) {
    return (
      <Layout>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-black">Product not found</h1>
          <Link to="/products" className="mt-4 inline-block text-neon">Back to products</Link>
        </div>
      </Layout>
    );
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const wished = wishlist.includes(product.id);
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-card p-6">
              <motion.img
                src={product.image}
                alt={product.name}
                width={800}
                height={800}
                className="mx-auto aspect-square w-full max-w-lg object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.badges.includes("bestseller") && (
                  <span className="rounded-full bg-gradient-gold px-3 py-1 text-[11px] font-bold uppercase text-primary-foreground">Best Seller</span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-gradient-neon px-3 py-1 text-[11px] font-bold uppercase text-neon-foreground">-{discount}%</span>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{product.brand}</div>
            <h1 className="mt-1 font-display text-3xl font-black leading-tight sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <span className="text-sm font-bold">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-4xl font-black text-gradient-gold">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
              {discount > 0 && <span className="rounded-md bg-neon/20 px-2 py-0.5 text-xs font-bold text-neon">Save {discount}%</span>}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Meta label="Flavor" value={product.flavor} />
              <Meta label="Weight" value={product.weight} />
              <Meta label="Stock" value={product.stock > 0 ? `${product.stock} left` : "Out of Stock"} accent={product.stock <= 0} />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-border">
                <button
                  disabled={product.stock <= 0 || qty <= 1}
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="grid h-11 w-11 place-items-center hover:bg-muted rounded-l-full disabled:opacity-20"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold">{product.stock <= 0 ? 0 : qty}</span>
                <button
                  disabled={product.stock <= 0 || qty >= product.stock}
                  onClick={() => setQty(qty + 1)}
                  className="grid h-11 w-11 place-items-center hover:bg-muted rounded-r-full disabled:opacity-20"
                >
                  +
                </button>
              </div>
              <button
                disabled={product.stock <= 0}
                onClick={() => { add(product, qty); toast.success("Added to cart"); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-gold hover:scale-[1.02] transition disabled:bg-none disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-4 w-4" /> {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`grid h-11 w-11 place-items-center rounded-full border border-border hover:border-neon ${wished ? "text-neon" : ""}`}
              >
                <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
              </button>
            </div>

            {product.stock > 0 ? (
              <Link
                to="/checkout"
                onClick={() => add(product, qty)}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-neon px-6 py-3 text-sm font-bold text-neon-foreground shadow-neon"
              >
                <Zap className="h-4 w-4" /> Buy Now
              </Link>
            ) : (
              <button
                disabled
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-muted px-6 py-3 text-sm font-bold text-muted-foreground cursor-not-allowed"
              >
                <Zap className="h-4 w-4" /> Buy Now
              </button>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-surface/60 p-4 text-xs text-muted-foreground sm:grid-cols-3">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-neon" /> Authentic</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-neon" /> Lab tested</div>
              <div className="flex items-center gap-2"><Share2 className="h-4 w-4 text-neon" /> Free shipping over ₹1499</div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-gradient-card p-6">
          <div className="flex flex-wrap gap-2 border-b border-border pb-3">
            {(["desc", "nutri", "usage"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase ${
                  tab === k ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {k === "desc" ? "Description & Benefits" : k === "nutri" ? "Nutrition Facts" : "How to Use"}
              </button>
            ))}
          </div>
          <div className="pt-5 text-sm text-muted-foreground">
            {tab === "desc" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-foreground/90">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />{b}
                    </li>
                  ))}
                </ul>
                <div>
                  <div className="font-bold text-foreground">Ingredients</div>
                  <p className="mt-1">{product.ingredients}</p>
                </div>
              </div>
            )}
            {tab === "nutri" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {product.nutrition.map((n) => (
                  <div key={n.label} className="rounded-xl border border-border bg-surface p-4 text-center">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{n.label}</div>
                    <div className="mt-1 font-display text-xl font-black text-gradient-neon">{n.value}</div>
                  </div>
                ))}
              </div>
            )}
            {tab === "usage" && <p>{product.usage}</p>}
          </div>
        </div>
      </section>

      {related.length > 0 && <ProductGrid title="Related Products" products={related} />}
    </Layout>
  );
}

function Meta({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-sm font-bold ${accent ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}
