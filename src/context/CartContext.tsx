import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type State = {
  items: CartItem[];
  wishlist: string[];
  isOpen: boolean;
};

type Action =
  | { type: "ADD"; product: Product; quantity?: number }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; id: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE_WISHLIST"; id: string }
  | { type: "HYDRATE"; state: State };

const initial: State = { items: [], wishlist: [], isOpen: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      const quantity = action.quantity ?? 1;
      const items = existing
        ? state.items.map((i) =>
            i.product.id === action.product.id ? { ...i, quantity: i.quantity + quantity } : i,
          )
        : [...state.items, { product: action.product, quantity }];
      return { ...state, items, isOpen: true };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.id) };
    case "UPDATE":
      return {
        ...state,
        items: state.items
          .map((i) => (i.product.id === action.id ? { ...i, quantity: action.quantity } : i))
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE_WISHLIST": {
      const set = new Set(state.wishlist);
      set.has(action.id) ? set.delete(action.id) : set.add(action.id);
      return { ...state, wishlist: [...set] };
    }
    case "HYDRATE":
      return { ...action.state, isOpen: false };
    default:
      return state;
  }
}

type CartAPI = {
  items: CartItem[];
  wishlist: string[];
  isOpen: boolean;
  add: (p: Product, q?: number) => void;
  remove: (id: string) => void;
  update: (id: string, q: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggleWishlist: (id: string) => void;
  subtotal: number;
  discount: number;
  count: number;
};

const Ctx = createContext<CartAPI | null>(null);

const STORAGE_KEY = "proteinx_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: state.items, wishlist: state.wishlist, isOpen: false }),
    );
  }, [state.items, state.wishlist]);

  const api = useMemo<CartAPI>(() => {
    const subtotal = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const mrpTotal = state.items.reduce((s, i) => s + i.product.mrp * i.quantity, 0);
    const discount = mrpTotal - subtotal;
    const count = state.items.reduce((s, i) => s + i.quantity, 0);
    return {
      items: state.items,
      wishlist: state.wishlist,
      isOpen: state.isOpen,
      add: (p, q) => dispatch({ type: "ADD", product: p, quantity: q }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      update: (id, quantity) => dispatch({ type: "UPDATE", id, quantity }),
      clear: () => dispatch({ type: "CLEAR" }),
      open: () => dispatch({ type: "OPEN" }),
      close: () => dispatch({ type: "CLOSE" }),
      toggleWishlist: (id) => dispatch({ type: "TOGGLE_WISHLIST", id }),
      subtotal,
      discount,
      count,
    };
  }, [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
