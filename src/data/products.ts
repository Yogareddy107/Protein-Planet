import whey from "@/assets/product-whey.jpg";
import gainer from "@/assets/product-gainer.jpg";
import creatine from "@/assets/product-creatine.jpg";
import preworkout from "@/assets/product-preworkout.jpg";
import bcaa from "@/assets/product-bcaa.jpg";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  flavor: string;
  weight: string;
  mrp: number;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  badges: ("bestseller" | "new" | "offer")[];
  description: string;
  benefits: string[];
  ingredients: string;
  nutrition: { label: string; value: string }[];
  usage: string;
};

// Static fallbacks used when a live product/category has no uploaded image yet.
const FALLBACK_IMAGES: Record<string, string> = {
  "whey-protein": whey,
  "mass-gainer": gainer,
  creatine: creatine,
  "pre-workout": preworkout,
  bcaa: bcaa,
  "fat-burner": preworkout,
  multivitamins: creatine,
  accessories: whey,
  oats: gainer,
  "peanut-butter": gainer,
};

export function fallbackImageFor(categorySlug?: string | null): string {
  if (!categorySlug) return whey;
  return FALLBACK_IMAGES[categorySlug] ?? whey;
}

// Category icons used when a live category has no uploaded image.
export const CATEGORY_ICONS: Record<string, string> = {
  "whey-protein": "🥛",
  "mass-gainer": "💪",
  creatine: "⚡",
  "pre-workout": "🔥",
  bcaa: "🧬",
  "fat-burner": "🔥",
  multivitamins: "💊",
  accessories: "🎽",
  oats: "🌾",
  "peanut-butter": "🥜",
};

// Brand + admin config
export const BRAND_NAME = "Protein Planet";
export const ADMIN_PIN = "188199";
export const OWNER_WHATSAPP = "918106002793";
