import { Link, useNavigate } from "@tanstack/react-router";
import { Dumbbell, Instagram, Facebook, Youtube } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_PIN } from "@/data/products";
import { toast } from "sonner";

export function Footer() {
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem("proteinx_admin", "1");
      setPinOpen(false);
      setPin("");
      toast.success("Welcome, Admin");
      navigate({ to: "/admin" });
    } else {
      toast.error("Invalid PIN");
      setPin("");
    }
  };

  return (
    <footer className="relative mt-16 border-t border-border/60 bg-black/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-gold text-primary-foreground shadow-gold">
              <Dumbbell className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">
              Protein <span className="text-gradient-neon">Planet</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Premium supplements engineered for serious athletes. 100% authentic, lab tested.
          </p>
          <div className="mt-4 flex gap-2">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition hover:border-neon hover:text-neon"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">Shop</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-neon">All Products</Link></li>
            <li><Link to="/categories" className="hover:text-neon">Categories</Link></li>
            <li><Link to="/offers" className="hover:text-neon">Offers</Link></li>
            <li><Link to="/wishlist" className="hover:text-neon">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-neon">About</Link></li>
            <li><Link to="/contact" className="hover:text-neon">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">Support</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Free shipping over ₹1499</li>
            <li>7-day sealed returns</li>
            <li>Certified authentic</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Protein Planet. All rights reserved.
            </p>
            <span className="hidden sm:inline text-xs text-muted-foreground/30">•</span>
            <p className="text-xs text-muted-foreground">
              Crafted by <span className="text-gradient-gold font-bold">Intrasphere Labs</span>
            </p>
          </div>
          <button
            aria-label="ornament"
            onClick={() => setPinOpen(true)}
            className="group opacity-60 transition hover:opacity-100"
            title=""
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-muted-foreground group-hover:text-neon transition" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 4h10a1 1 0 0 1 1 1v1H6V5a1 1 0 0 1 1-1z" />
              <path d="M6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7z" />
              <path d="M9 11h6M9 14h6" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {pinOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md"
            onClick={() => setPinOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onSubmit={submit}
              onClick={(e) => e.stopPropagation()}
              className="w-[92%] max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-premium"
            >
              <h3 className="font-display text-xl font-black">Enter Admin PIN</h3>
              <p className="mt-1 text-xs text-muted-foreground">Access restricted to store owner.</p>
              <input
                autoFocus
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="mt-5 w-full rounded-lg border border-border bg-background px-4 py-3 text-center font-display text-2xl tracking-[0.5em] outline-none focus:border-neon"
              />
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPinOpen(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-bold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-gold px-4 py-2 text-sm font-bold text-primary-foreground shadow-gold"
                >
                  Unlock
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
