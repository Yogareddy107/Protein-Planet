import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, FolderTree, Tag, ShoppingCart, Users,
  Image as ImageIcon, Settings, LogOut, TrendingUp, IndianRupee,
  Pencil, Trash2, Plus, Upload, X, Check, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useProducts, useCategories, useOffers, useBanners, useOrders, useSettings,
  useUpsertRow, useDeleteRow, useUpdateOrderStatus, useUpdateSettings,
  uploadImage, type ImageBucket, type OrderStatus, type OrderRow,
  type OfferRow, type BannerRow, type CategoryRow, type ProductRow,
} from "@/lib/store";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Protein Planet" }, { name: "robots", content: "noindex" }] }),
});

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "categories", label: "Categories", icon: FolderTree },
  { key: "offers", label: "Offers", icon: Tag },
  { key: "banners", label: "Banners", icon: ImageIcon },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "customers", label: "Customers", icon: Users },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

type TabKey = (typeof NAV)[number]["key"];

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("proteinx_admin") !== "1") {
      navigate({ to: "/" });
    } else {
      setAuthed(true);
    }
  }, [navigate]);

  if (!authed) return null;

  const logout = () => {
    sessionStorage.removeItem("proteinx_admin");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-border bg-sidebar p-5">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-gold text-primary-foreground shadow-gold">⚡</span>
            <span className="font-display text-lg font-bold">
              Protein <span className="text-gradient-neon">Planet</span> <span className="text-xs text-muted-foreground">Admin</span>
            </span>
          </Link>
          <nav className="space-y-1">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => setTab(n.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  tab === n.key
                    ? "bg-gradient-gold text-primary-foreground shadow-gold"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </nav>
        </aside>

        <main className="p-6 sm:p-8">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {tab === "dashboard" && <Dashboard />}
            {tab === "products" && <ProductsAdmin />}
            {tab === "categories" && <CategoriesAdmin />}
            {tab === "offers" && <OffersAdmin />}
            {tab === "banners" && <BannersAdmin />}
            {tab === "orders" && <OrdersAdmin />}
            {tab === "customers" && <CustomersAdmin />}
            {tab === "settings" && <SettingsAdmin />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// ============= DASHBOARD =============
function Dashboard() {
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const revenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const uniqueCustomers = new Set(orders.map((o) => o.phone)).size;

  const stats = [
    { label: "Total Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Orders", value: `${orders.length}`, icon: ShoppingCart },
    { label: "Customers", value: `${uniqueCustomers}`, icon: Users },
    { label: "Products", value: `${products.length}`, icon: Package },
  ];
  return (
    <div>
      <h1 className="font-display text-3xl font-black">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Welcome back, Admin.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-gradient-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</div>
              <s.icon className="h-4 w-4 text-neon" />
            </div>
            <div className="mt-3 font-display text-3xl font-black">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-gradient-card p-6">
        <h2 className="font-display text-lg font-bold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-neon" /> Recent Orders
        </h2>
        <ul className="mt-4 divide-y divide-border">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-bold">{o.order_no}</div>
                <div className="text-xs text-muted-foreground">{o.customer_name} • {o.phone}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">₹{Number(o.total).toLocaleString("en-IN")}</div>
                <StatusPill status={o.status} />
              </div>
            </li>
          ))}
          {orders.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No orders yet.</li>}
        </ul>
      </div>
    </div>
  );
}

// ============= PRODUCTS =============
function ProductsAdmin() {
  const { data: products = [] } = useProducts();
  const upsert = useUpsertRow("products");
  const del = useDeleteRow("products");
  const [editing, setEditing] = useState<Partial<ProductRow> | null>(null);

  // We need raw rows to edit (rowToProduct discards ids). Refetch raw.
  const { data: raw = [] } = useQuery({
    queryKey: ["products-raw"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as ProductRow[];
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-black">Products</h1>
        <button onClick={() => setEditing({ badges: [], benefits: [], nutrition: [], active: true, brand: "Protein Planet" })}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-sm font-bold text-primary-foreground shadow-gold">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const row = raw.find((r) => r.slug === p.id);
              return (
                <tr key={p.id} className="border-t border-border hover:bg-surface/60">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.weight}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 capitalize">{p.category.replace("-", " ")}</td>
                  <td className="p-3 font-bold">₹{p.price}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => row && setEditing(row)} className="mr-2 rounded-lg border border-border p-2 hover:border-neon"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => row && confirmDelete(() => del.mutate(row.id))} className="rounded-lg border border-border p-2 hover:border-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No products yet — add your first.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={async (payload) => {
            await upsert.mutateAsync(payload);
            toast.success("Product saved");
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ initial, onClose, onSave }: { initial: Partial<ProductRow>; onClose: () => void; onSave: (p: Record<string, unknown>) => Promise<void> }) {
  const { data: cats = [] } = useCategories();
  const [form, setForm] = useState<Partial<ProductRow>>(initial);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof ProductRow>(k: K, v: ProductRow[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage("product-images", file);
      set("image_url", url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error("Upload failed");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal onClose={onClose} title={form.id ? "Edit Product" : "New Product"}>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Slug (unique)" value={form.slug ?? ""} onChange={(v) => set("slug", v)} />
        <TextField label="Name" value={form.name ?? ""} onChange={(v) => set("name", v)} />
        <TextField label="Brand" value={form.brand ?? ""} onChange={(v) => set("brand", v)} />
        <SelectField label="Category" value={form.category_slug ?? ""} onChange={(v) => set("category_slug", v)}
          options={cats.map((c) => ({ value: c.slug, label: c.name }))} />
        <TextField label="Flavor" value={form.flavor ?? ""} onChange={(v) => set("flavor", v)} />
        <TextField label="Weight" value={form.weight ?? ""} onChange={(v) => set("weight", v)} />
        <NumField label="MRP (₹)" value={Number(form.mrp ?? 0)} onChange={(v) => set("mrp", v)} />
        <NumField label="Price (₹)" value={Number(form.price ?? 0)} onChange={(v) => set("price", v)} />
        <NumField label="Stock" value={Number(form.stock ?? 0)} onChange={(v) => set("stock", v)} />
        <NumField label="Rating" value={Number(form.rating ?? 4.7)} onChange={(v) => set("rating", v)} step={0.1} />
        <TextField label="Badges (comma separated)" value={(form.badges ?? []).join(",")} onChange={(v) => set("badges", v.split(",").map((s) => s.trim()).filter(Boolean))} />
        <TextField label="Benefits (comma separated)" value={(form.benefits ?? []).join(",")} onChange={(v) => set("benefits", v.split(",").map((s) => s.trim()).filter(Boolean))} />
        <div className="sm:col-span-2">
          <ImageField label="Product Image" value={form.image_url ?? ""} uploading={uploading}
            onFile={handleUpload} onClear={() => set("image_url", null)} />
        </div>
        <TextArea label="Description" value={form.description ?? ""} onChange={(v) => set("description", v)} />
        <TextArea label="Ingredients" value={form.ingredients ?? ""} onChange={(v) => set("ingredients", v)} />
        <TextArea label="How to use" value={form.usage ?? ""} onChange={(v) => set("usage", v)} />
        <TextArea label='Nutrition (JSON e.g. [{"label":"Protein","value":"24 g"}])' value={JSON.stringify(form.nutrition ?? [])}
          onChange={(v) => { try { set("nutrition", JSON.parse(v)); } catch { /* ignore */ } }} />
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm font-bold hover:bg-muted">Cancel</button>
        <button
          onClick={() => onSave(form as Record<string, unknown>)}
          className="rounded-full bg-gradient-gold px-5 py-2 text-sm font-bold text-primary-foreground shadow-gold"
        >Save</button>
      </div>
    </Modal>
  );
}

// ============= CATEGORIES =============
function CategoriesAdmin() {
  const { data: cats = [] } = useCategories();
  const upsert = useUpsertRow("categories");
  const del = useDeleteRow("categories");
  const [editing, setEditing] = useState<Partial<CategoryRow> | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-black">Categories</h1>
        <button onClick={() => setEditing({ sort_order: cats.length + 1 })}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-sm font-bold text-primary-foreground shadow-gold">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((c) => (
          <div key={c.slug} className="rounded-2xl border border-border bg-gradient-card p-5">
            {c.image_url ? <img src={c.image_url} alt="" className="mb-3 h-24 w-full rounded-lg object-cover" /> : <div className="text-3xl">{c.icon}</div>}
            <div className="mt-2 font-display text-lg font-bold">{c.name}</div>
            <div className="text-xs text-muted-foreground">/{c.slug}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing(c as unknown as CategoryRow)} className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs hover:border-neon"><Pencil className="mx-auto h-4 w-4" /></button>
              <button onClick={() => confirmDelete(() => del.mutate(c.id))} className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs hover:border-destructive hover:text-destructive"><Trash2 className="mx-auto h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <CategoryForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={async (p) => { await upsert.mutateAsync(p); toast.success("Category saved"); setEditing(null); }}
        />
      )}
    </div>
  );
}

function CategoryForm({ initial, onClose, onSave }: { initial: Partial<CategoryRow>; onClose: () => void; onSave: (p: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = useState<Partial<CategoryRow>>(initial);
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof CategoryRow>(k: K, v: CategoryRow[K]) => setForm((f) => ({ ...f, [k]: v }));
  const handleUpload = async (file: File) => {
    setUploading(true);
    try { set("image_url", await uploadImage("category-images", file)); toast.success("Image uploaded"); }
    catch (e) { toast.error("Upload failed"); console.error(e); }
    finally { setUploading(false); }
  };
  return (
    <Modal onClose={onClose} title={form.id ? "Edit Category" : "New Category"}>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Slug (unique)" value={form.slug ?? ""} onChange={(v) => set("slug", v)} />
        <TextField label="Name" value={form.name ?? ""} onChange={(v) => set("name", v)} />
        <TextField label="Icon (emoji)" value={form.icon ?? ""} onChange={(v) => set("icon", v)} />
        <NumField label="Sort Order" value={Number(form.sort_order ?? 0)} onChange={(v) => set("sort_order", v)} />
        <div className="sm:col-span-2">
          <ImageField label="Category Image" value={form.image_url ?? ""} uploading={uploading}
            onFile={handleUpload} onClear={() => set("image_url", null)} />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm font-bold hover:bg-muted">Cancel</button>
        <button onClick={() => onSave(form as Record<string, unknown>)} className="rounded-full bg-gradient-gold px-5 py-2 text-sm font-bold text-primary-foreground shadow-gold">Save</button>
      </div>
    </Modal>
  );
}

// ============= OFFERS =============
function OffersAdmin() {
  const { data: offers = [] } = useOffers();
  const upsert = useUpsertRow("offers");
  const del = useDeleteRow("offers");
  const [editing, setEditing] = useState<Partial<OfferRow> | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-black">Offers</h1>
        <button onClick={() => setEditing({ active: true, discount_percent: 10, link: "/products" })}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-sm font-bold text-primary-foreground shadow-gold">
          <Plus className="h-4 w-4" /> Add Offer
        </button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o) => (
          <div key={o.id} className="overflow-hidden rounded-2xl border border-border bg-gradient-card">
            {o.image_url && <img src={o.image_url} alt="" className="h-32 w-full object-cover" />}
            <div className="p-4">
              <div className="font-display text-lg font-bold">{o.title}</div>
              <div className="text-xs text-muted-foreground">{o.subtitle}</div>
              <div className="mt-2 text-sm text-neon">{o.discount_percent}% off</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(o)} className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs hover:border-neon"><Pencil className="mx-auto h-4 w-4" /></button>
                <button onClick={() => confirmDelete(() => del.mutate(o.id))} className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs hover:border-destructive hover:text-destructive"><Trash2 className="mx-auto h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {offers.length === 0 && <div className="col-span-full rounded-2xl border border-border bg-gradient-card p-8 text-center text-muted-foreground">No offers yet.</div>}
      </div>

      {editing && (
        <OfferForm initial={editing} onClose={() => setEditing(null)}
          onSave={async (p) => { await upsert.mutateAsync(p); toast.success("Offer saved"); setEditing(null); }} />
      )}
    </div>
  );
}

function OfferForm({ initial, onClose, onSave }: { initial: Partial<OfferRow>; onClose: () => void; onSave: (p: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = useState<Partial<OfferRow>>(initial);
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof OfferRow>(k: K, v: OfferRow[K]) => setForm((f) => ({ ...f, [k]: v }));
  const handleUpload = async (file: File) => {
    setUploading(true);
    try { set("image_url", await uploadImage("banner-images", file)); toast.success("Image uploaded"); }
    catch (e) { toast.error("Upload failed"); console.error(e); }
    finally { setUploading(false); }
  };
  return (
    <Modal onClose={onClose} title={form.id ? "Edit Offer" : "New Offer"}>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Title" value={form.title ?? ""} onChange={(v) => set("title", v)} />
        <TextField label="Subtitle" value={form.subtitle ?? ""} onChange={(v) => set("subtitle", v)} />
        <NumField label="Discount %" value={Number(form.discount_percent ?? 0)} onChange={(v) => set("discount_percent", v)} />
        <TextField label="Link" value={form.link ?? "/products"} onChange={(v) => set("link", v)} />
        <div className="sm:col-span-2">
          <ImageField label="Offer Image" value={form.image_url ?? ""} uploading={uploading}
            onFile={handleUpload} onClear={() => set("image_url", null)} />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm font-bold hover:bg-muted">Cancel</button>
        <button onClick={() => onSave(form as Record<string, unknown>)} className="rounded-full bg-gradient-gold px-5 py-2 text-sm font-bold text-primary-foreground shadow-gold">Save</button>
      </div>
    </Modal>
  );
}

// ============= BANNERS =============
function BannersAdmin() {
  const { data: banners = [] } = useBanners();
  const upsert = useUpsertRow("banners");
  const del = useDeleteRow("banners");
  const [editing, setEditing] = useState<Partial<BannerRow> | null>(null);
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-black">Banners</h1>
        <button onClick={() => setEditing({ active: true, sort_order: banners.length + 1, link: "/products" })}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2 text-sm font-bold text-primary-foreground shadow-gold">
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {banners.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-2xl border border-border bg-gradient-card">
            {b.image_url && <img src={b.image_url} alt="" className="h-40 w-full object-cover" />}
            <div className="p-4">
              <div className="font-display text-lg font-bold">{b.title}</div>
              <div className="text-xs text-muted-foreground">{b.subtitle}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(b)} className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs hover:border-neon"><Pencil className="mx-auto h-4 w-4" /></button>
                <button onClick={() => confirmDelete(() => del.mutate(b.id))} className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs hover:border-destructive hover:text-destructive"><Trash2 className="mx-auto h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && <div className="col-span-full rounded-2xl border border-border bg-gradient-card p-8 text-center text-muted-foreground">No banners yet.</div>}
      </div>
      {editing && (
        <BannerForm initial={editing} onClose={() => setEditing(null)}
          onSave={async (p) => { await upsert.mutateAsync(p); toast.success("Banner saved"); setEditing(null); }} />
      )}
    </div>
  );
}

function BannerForm({ initial, onClose, onSave }: { initial: Partial<BannerRow>; onClose: () => void; onSave: (p: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = useState<Partial<BannerRow>>(initial);
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof BannerRow>(k: K, v: BannerRow[K]) => setForm((f) => ({ ...f, [k]: v }));
  const handleUpload = async (file: File) => {
    setUploading(true);
    try { set("image_url", await uploadImage("banner-images", file)); toast.success("Image uploaded"); }
    catch (e) { toast.error("Upload failed"); console.error(e); }
    finally { setUploading(false); }
  };
  return (
    <Modal onClose={onClose} title={form.id ? "Edit Banner" : "New Banner"}>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Title" value={form.title ?? ""} onChange={(v) => set("title", v)} />
        <TextField label="Subtitle" value={form.subtitle ?? ""} onChange={(v) => set("subtitle", v)} />
        <TextField label="Link" value={form.link ?? "/products"} onChange={(v) => set("link", v)} />
        <NumField label="Sort Order" value={Number(form.sort_order ?? 0)} onChange={(v) => set("sort_order", v)} />
        <div className="sm:col-span-2">
          <ImageField label="Banner Image" value={form.image_url ?? ""} uploading={uploading}
            onFile={handleUpload} onClear={() => set("image_url", null)} />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm font-bold hover:bg-muted">Cancel</button>
        <button onClick={() => onSave(form as Record<string, unknown>)} className="rounded-full bg-gradient-gold px-5 py-2 text-sm font-bold text-primary-foreground shadow-gold">Save</button>
      </div>
    </Modal>
  );
}

// ============= ORDERS =============
function OrdersAdmin() {
  const { data: orders = [] } = useOrders();
  const del = useDeleteRow("banners"); // unused placeholder — orders use separate mutation
  const updateStatus = useUpdateOrderStatus();
  const [view, setView] = useState<OrderRow | null>(null);

  const handleStatusChange = async (order: OrderRow, newStatus: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id: order.id, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      
      // Auto-trigger WhatsApp notification to customer
      const trackingLink = `${window.location.origin}/order-confirmation/${order.id}`;
      const message = [
        `Hello *${order.customer_name}*,`,
        "",
        `Your order *${order.order_no}* status has been updated to: *${newStatus}*.`,
        "",
        `You can track your live order timeline here: ${trackingLink}`,
        "",
        `Thank you for shopping with Protein Planet!`
      ].join("\n");
      
      const phoneDigits = order.phone.replace(/[^0-9]/g, "");
      const formattedPhone = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
      
      const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-black">Orders</h1>
      <p className="text-sm text-muted-foreground">Live WhatsApp orders from your checkout.</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border hover:bg-surface/60">
                <td className="p-3">
                  <div className="font-bold">{o.order_no}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
                </td>
                <td className="p-3">
                  <div>{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{o.phone}</div>
                </td>
                <td className="p-3 font-bold">₹{Number(o.total).toLocaleString("en-IN")}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o, e.target.value as OrderStatus)}
                    className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                  >
                    {(["Pending", "Confirmed", "Delivered", "Cancelled"] as OrderStatus[]).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => setView(o)} className="rounded-lg border border-border px-3 py-1.5 text-xs hover:border-neon">View</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {view && (
        <Modal onClose={() => setView(null)} title={`Order ${view.order_no}`}>
          <div className="space-y-4 text-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <div><b>Customer:</b> {view.customer_name}</div>
              <div><b>Phone:</b> {view.phone}{view.alt_phone ? ` / ${view.alt_phone}` : ""}</div>
              <div className="sm:col-span-2"><b>Address:</b> {view.address}{view.landmark ? `, ${view.landmark}` : ""}, {view.city}, {view.state} - {view.pincode}</div>
              {view.notes && <div className="sm:col-span-2"><b>Notes:</b> {view.notes}</div>}
            </div>
            <div className="rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-surface-elevated text-muted-foreground"><tr><th className="p-2 text-left">Item</th><th className="p-2">Qty</th><th className="p-2">Price</th></tr></thead>
                <tbody>
                  {view.items.map((it, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2">{it.name} <span className="text-muted-foreground">({it.flavor} • {it.weight})</span></td>
                      <td className="p-2 text-center">{it.quantity}</td>
                      <td className="p-2 text-right">₹{(it.price * it.quantity).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-1 text-right">
              <div>Subtotal: ₹{Number(view.subtotal).toLocaleString("en-IN")}</div>
              <div>Discount: ₹{Number(view.discount).toLocaleString("en-IN")}</div>
              <div>Shipping: ₹{Number(view.shipping).toLocaleString("en-IN")}</div>
              <div className="font-display text-lg font-black">Total: ₹{Number(view.total).toLocaleString("en-IN")}</div>
            </div>

            {/* Status Timeline */}
            <div className="border-t border-border pt-4">
              <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-neon" /> Order Status Timeline
              </h3>
              <div className="relative border-l border-border pl-5 ml-2.5 space-y-4">
                {(view.status_history || [{ status: view.status, timestamp: view.created_at }]).map((h, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[27px] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-neon text-neon-foreground ring-4 ring-neon/20 shadow-neon" />
                    <div>
                      <div className="text-xs font-bold">{h.status}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(h.timestamp).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
      {del ? null : null}
    </div>
  );
}

// ============= CUSTOMERS =============
function CustomersAdmin() {
  const { data: orders = [] } = useOrders();
  const map = new Map<string, { name: string; phone: string; orders: number; total: number }>();
  orders.forEach((o) => {
    const key = o.phone;
    const cur = map.get(key) ?? { name: o.customer_name, phone: o.phone, orders: 0, total: 0 };
    cur.orders += 1;
    cur.total += Number(o.total);
    map.set(key, cur);
  });
  const customers = [...map.values()].sort((a, b) => b.total - a.total);
  return (
    <div>
      <h1 className="font-display text-3xl font-black">Customers</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated text-xs uppercase text-muted-foreground">
            <tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Phone</th><th className="p-3 text-left">Orders</th><th className="p-3 text-left">Total Spent</th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.phone} className="border-t border-border">
                <td className="p-3 font-bold">{c.name}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.orders}</td>
                <td className="p-3 font-bold">₹{c.total.toLocaleString("en-IN")}</td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No customers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============= SETTINGS =============
function SettingsAdmin() {
  const { data: settings } = useSettings();
  const update = useUpdateSettings();
  const [form, setForm] = useState({
    store_name: "", owner_whatsapp: "", free_shipping_above: 1499,
    instagram: "", facebook: "", youtube: "",
  });
  useEffect(() => {
    if (settings) setForm({
      store_name: settings.store_name,
      owner_whatsapp: settings.owner_whatsapp,
      free_shipping_above: Number(settings.free_shipping_above),
      instagram: settings.instagram ?? "",
      facebook: settings.facebook ?? "",
      youtube: settings.youtube ?? "",
    });
  }, [settings]);
  return (
    <div>
      <h1 className="font-display text-3xl font-black">Store Settings</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <TextField label="Store Name" value={form.store_name} onChange={(v) => setForm({ ...form, store_name: v })} />
        <TextField label="Owner WhatsApp (with country code, no +)" value={form.owner_whatsapp} onChange={(v) => setForm({ ...form, owner_whatsapp: v })} />
        <NumField label="Free Shipping Above (₹)" value={form.free_shipping_above} onChange={(v) => setForm({ ...form, free_shipping_above: v })} />
        <TextField label="Instagram" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />
        <TextField label="Facebook" value={form.facebook} onChange={(v) => setForm({ ...form, facebook: v })} />
        <TextField label="YouTube" value={form.youtube} onChange={(v) => setForm({ ...form, youtube: v })} />
      </div>
      <button
        onClick={async () => { await update.mutateAsync(form); toast.success("Settings saved"); }}
        className="mt-6 rounded-full bg-gradient-gold px-6 py-2 text-sm font-bold text-primary-foreground shadow-gold"
      >Save Settings</button>
      <div className="mt-6 rounded-2xl border border-border bg-gradient-card p-4 text-xs text-muted-foreground">
        Admin PIN is hardcoded in <code>src/data/products.ts</code>. Change it there and redeploy.
      </div>
    </div>
  );
}

// ============= SHARED UI HELPERS =============
function StatusPill({ status }: { status: OrderStatus }) {
  const colors: Record<OrderStatus, string> = {
    Pending: "bg-primary/20 text-primary",
    Confirmed: "bg-blue-500/20 text-blue-400",
    Delivered: "bg-neon/20 text-neon",
    Cancelled: "bg-destructive/20 text-destructive",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${colors[status]}`}>{status}</span>;
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-md" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-border bg-surface p-6 shadow-premium"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-black">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-neon" />
    </label>
  );
}

function NumField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-neon" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 sm:col-span-2">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-neon" />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-neon">
        <option value="">Select...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function ImageField({ label, value, uploading, onFile, onClear }: { label: string; value: string; uploading: boolean; onFile: (f: File) => void; onClear: () => void }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-center gap-3">
        {value ? <img src={value} alt="" className="h-20 w-20 rounded-lg border border-border object-cover" /> : <div className="grid h-20 w-20 place-items-center rounded-lg border border-dashed border-border text-muted-foreground"><ImageIcon className="h-5 w-5" /></div>}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-neon px-4 py-2 text-xs font-bold text-neon-foreground shadow-neon hover:scale-105 transition">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : value ? "Replace" : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </label>
        {value && (
          <button onClick={onClear} className="rounded-lg border border-border p-2 hover:border-destructive hover:text-destructive"><X className="h-4 w-4" /></button>
        )}
      </div>
    </div>
  );
}

function confirmDelete(fn: () => void) {
  if (typeof window !== "undefined" && window.confirm("Delete this item? This cannot be undone.")) {
    fn();
  }
}

// export unused icon to keep tree-shake happy
export const _keepImports = Check;
