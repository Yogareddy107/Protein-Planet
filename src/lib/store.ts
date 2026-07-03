// Live Supabase-backed queries and mutations for the storefront + admin.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";
import { fallbackImageFor, CATEGORY_ICONS } from "@/data/products";

// ---------- Row types ----------
export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category_slug: string;
  flavor: string | null;
  weight: string | null;
  mrp: number;
  price: number;
  image_url: string | null;
  rating: number;
  reviews: number;
  stock: number;
  badges: string[];
  description: string | null;
  benefits: string[];
  ingredients: string | null;
  nutrition: { label: string; value: string }[];
  usage: string | null;
  active: boolean;
};

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
};

export type OfferRow = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  discount_percent: number | null;
  link: string | null;
  expires_at: string | null;
  active: boolean;
};

export type BannerRow = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link: string | null;
  sort_order: number;
  active: boolean;
};

export type SettingsRow = {
  id: number;
  store_name: string;
  owner_whatsapp: string;
  free_shipping_above: number;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
};

export type OrderStatus = "Pending" | "Confirmed" | "Delivered" | "Cancelled";

export type OrderItemJSON = {
  product_id: string;
  slug: string;
  name: string;
  flavor: string;
  weight: string;
  image_url: string | null;
  price: number;
  quantity: number;
};

export type OrderRow = {
  id: string;
  order_no: string;
  customer_name: string;
  phone: string;
  alt_phone: string | null;
  address: string;
  landmark: string | null;
  city: string;
  state: string | null;
  pincode: string;
  notes: string | null;
  items: OrderItemJSON[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  channel: string;
  created_at: string;
  status_history?: { status: OrderStatus; timestamp: string }[];
};

// ---------- Adapters ----------
export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.slug, // routes use slug as id
    name: row.name,
    brand: row.brand,
    category: row.category_slug,
    flavor: row.flavor ?? "",
    weight: row.weight ?? "",
    mrp: Number(row.mrp),
    price: Number(row.price),
    image: row.image_url || fallbackImageFor(row.category_slug),
    rating: Number(row.rating),
    reviews: row.reviews,
    stock: row.stock,
    badges: (row.badges as Product["badges"]) ?? [],
    description: row.description ?? "",
    benefits: row.benefits ?? [],
    ingredients: row.ingredients ?? "",
    nutrition: row.nutrition ?? [],
    usage: row.usage ?? "",
  };
}

// ---------- Queries ----------
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as ProductRow[]).map(rowToProduct);
    },
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data ? rowToProduct(data as unknown as ProductRow) : null;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      
      const list = [...(data as CategoryRow[])];
      
      if (!list.some((c) => c.slug === "oats")) {
        list.push({
          id: "oats-fallback-id",
          slug: "oats",
          name: "Oats",
          icon: "🌾",
          image_url: null,
          sort_order: 9,
        });
      }
      
      if (!list.some((c) => c.slug === "peanut-butter")) {
        list.push({
          id: "pb-fallback-id",
          slug: "peanut-butter",
          name: "Peanut Butter",
          icon: "🥜",
          image_url: null,
          sort_order: 10,
        });
      }
      
      list.sort((a, b) => a.sort_order - b.sort_order);

      return list.map((c) => ({
        ...c,
        icon: c.icon || CATEGORY_ICONS[c.slug] || "🏋️",
      }));
    },
  });
}

export function useOffers() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as OfferRow[];
    },
  });
}

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as BannerRow[];
    },
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data as SettingsRow | null;
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as OrderRow[];
    },
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as OrderRow | null;
    },
  });
}

// ---------- Mutations ----------
type TableName = "products" | "categories" | "offers" | "banners";

export function useUpsertRow(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown> & { id?: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from(table) as any)
        .upsert(payload)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
}

export function useDeleteRow(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [table] }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<SettingsRow>) => {
      const { error } = await supabase
        .from("settings")
        .upsert({ id: 1, ...payload });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

// ---------- Storage ----------
export type ImageBucket = "product-images" | "category-images" | "banner-images";

// Upload a file to a bucket and return a long-lived signed URL (10 years).
export async function uploadImage(bucket: ImageBucket, file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (error) throw error;
  return data.signedUrl;
}

// Create a new order in Supabase.
export async function createOrder(payload: {
  customer_name: string;
  phone: string;
  alt_phone?: string;
  address: string;
  landmark?: string;
  city: string;
  state?: string;
  pincode: string;
  notes?: string;
  items: OrderItemJSON[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}): Promise<OrderRow> {
  const { data, error } = await supabase
    .from("orders")
    .insert(payload as never)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as OrderRow;
}
