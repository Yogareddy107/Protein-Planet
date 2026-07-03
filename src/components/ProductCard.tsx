import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const BADGE_STYLES: Record<string, string> = {
  bestseller: "bg-gradient-gold text-primary-foreground",
  new: "bg-gradient-neon text-neon-foreground",
  offer: "bg-destructive text-destructive-foreground",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add, toggleWishlist, wishlist } = useCart();
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const wished = wishlist.includes(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-3 shadow-premium transition-all hover:border-neon/40 hover:shadow-neon"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-black/40">
        <Link to="/product/$id" params={{ id: product.id }} className="block h-full w-full">
          <motion.img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.badges.map((b) => (
            <span
              key={b}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${BADGE_STYLES[b]}`}
            >
              {b === "bestseller" ? "Best Seller" : b}
            </span>
          ))}
          {discount > 0 && (
            <span className="rounded-full bg-neon px-2 py-0.5 text-[10px] font-bold text-neon-foreground">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
            toast(wished ? "Removed from wishlist" : "Added to wishlist");
          }}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full glass-strong text-foreground transition hover:text-neon"
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-neon text-neon" : ""}`} />
        </button>

        {/* Quick add on hover */}
        <div className="pointer-events-none absolute inset-x-2 bottom-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <button
            disabled={product.stock <= 0}
            onClick={(e) => {
              e.preventDefault();
              add(product);
              toast.success(`${product.name} added to cart`);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-xs font-bold text-primary-foreground shadow-gold disabled:bg-none disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      <Link to="/product/$id" params={{ id: product.id }} className="mt-3 block px-1">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{product.brand}</span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {product.rating} <span className="opacity-60">({product.reviews})</span>
          </span>
        </div>
        <h3 className="mt-1 line-clamp-2 font-display text-sm font-bold leading-tight">
          {product.name}
        </h3>
        <div className="mt-1 text-[11px] text-muted-foreground">
          {product.flavor} • {product.weight}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-lg font-black text-foreground">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.mrp.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px]">
          <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? "bg-neon" : "bg-destructive"}`} />
          <span className="text-muted-foreground">
            {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
