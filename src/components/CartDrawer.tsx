import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const { isOpen, close, items, update, remove, subtotal, discount, count } = useCart();
  const shipping = subtotal > 1499 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
          onClick={close}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-surface"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-neon" />
                <h3 className="font-display text-lg font-bold">Your Cart ({count})</h3>
              </div>
              <button
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="font-display text-lg font-bold">Your cart is empty</div>
                <p className="text-sm text-muted-foreground">Add some premium fuel to your cart.</p>
                <Link
                  to="/products"
                  onClick={close}
                  className="mt-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-gold"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-3">
                    {items.map((it) => (
                      <motion.li
                        key={it.product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-3 rounded-xl border border-border bg-gradient-card p-3"
                      >
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="h-20 w-20 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-2 text-sm font-bold">{it.product.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {it.product.flavor} • {it.product.weight}
                          </div>
                          <div className="mt-1 font-display text-base font-black">
                            ₹{(it.product.price * it.quantity).toLocaleString("en-IN")}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-lg border border-border">
                              <button
                                onClick={() => update(it.product.id, it.quantity - 1)}
                                className="grid h-7 w-7 place-items-center hover:bg-muted"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-bold">{it.quantity}</span>
                              <button
                                disabled={it.quantity >= it.product.stock}
                                onClick={() => update(it.product.id, it.quantity + 1)}
                                className="grid h-7 w-7 place-items-center hover:bg-muted disabled:opacity-20 disabled:pointer-events-none"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => remove(it.product.id)}
                              className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border p-5">
                  <div className="space-y-1.5 text-sm">
                    <Row label="Subtotal" value={`₹${subtotal.toLocaleString("en-IN")}`} />
                    <Row label="Discount" value={`- ₹${discount.toLocaleString("en-IN")}`} accent />
                    <Row
                      label="Shipping"
                      value={shipping === 0 ? "FREE" : `₹${shipping}`}
                      accent={shipping === 0}
                    />
                    <div className="my-2 border-t border-border" />
                    <Row label="Total" value={`₹${total.toLocaleString("en-IN")}`} bold />
                  </div>
                  <Link
                    to="/checkout"
                    onClick={close}
                    className="mt-4 block w-full rounded-full bg-gradient-gold py-3 text-center text-sm font-bold text-primary-foreground shadow-gold"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={close}
                    className="mt-2 block w-full rounded-full border border-border py-3 text-center text-sm font-bold hover:bg-muted"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, accent, bold }: { label: string; value: string; accent?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-display text-base font-bold" : "text-muted-foreground"}>{label}</span>
      <span className={`${bold ? "font-display text-lg font-black" : ""} ${accent ? "text-neon" : ""}`}>{value}</span>
    </div>
  );
}
