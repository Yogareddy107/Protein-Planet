import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, ShoppingBag, Heart, X, Dumbbell } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/offers", label: "Offers" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { open, count, wishlist } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-40 w-full transition-all duration-350 ${
        scrolled ? "py-3 px-4 bg-transparent" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex h-16 items-center gap-4 transition-all duration-350 ${
          scrolled
            ? "max-w-5xl rounded-full border border-border/80 bg-background/80 backdrop-blur-md shadow-premium px-6 ring-1 ring-white/5"
            : "max-w-7xl border-b border-border/60 glass-strong px-4 sm:px-6"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-gold text-primary-foreground shadow-gold">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Protein <span className="text-gradient-neon">Planet</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-neon"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/products"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-neon px-1 text-[10px] font-bold text-neon-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button
            onClick={open}
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-gold px-1 text-[10px] font-bold text-primary-foreground"
              >
                {count}
              </motion.span>
            )}
          </button>
          <button
            onClick={() => setMobile(true)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md lg:hidden"
            onClick={() => setMobile(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex h-full w-80 max-w-full flex-col bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold">Menu</span>
                <button
                  onClick={() => setMobile(false)}
                  className="grid h-10 w-10 place-items-center rounded-lg hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setMobile(false)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-muted"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
