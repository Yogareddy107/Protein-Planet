import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { OWNER_WHATSAPP } from "@/data/products";
import { createOrder, useSettings, type OrderItemJSON } from "@/lib/store";
import { toast } from "sonner";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — Protein Planet" }] }),
});

function CheckoutPage() {
  const { items, subtotal, discount, clear } = useCart();
  const { data: settings } = useSettings();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", altPhone: "", address: "", landmark: "",
    city: "", state: "", pincode: "", notes: "",
  });
  const freeThreshold = Number(settings?.free_shipping_above ?? 1499);
  const whatsappNumber = settings?.owner_whatsapp || OWNER_WHATSAPP;
  const shipping = subtotal > freeThreshold || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-black">Your cart is empty</h1>
          <Link to="/products" className="mt-4 inline-block rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-gold">
            Shop Now
          </Link>
        </div>
      </Layout>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error("Please fill in required fields");
      return;
    }
    setSubmitting(true);

    const orderItems: OrderItemJSON[] = items.map((it) => ({
      product_id: it.product.id,
      slug: it.product.id,
      name: it.product.name,
      flavor: it.product.flavor,
      weight: it.product.weight,
      image_url: it.product.image,
      price: it.product.price,
      quantity: it.quantity,
    }));

    try {
      // 1. Verify stock first
      const productSlugs = items.map((it) => it.product.id);
      const { data: dbProducts, error: stockCheckError } = await supabase
        .from("products")
        .select("slug, name, stock")
        .in("slug", productSlugs);

      if (stockCheckError) throw stockCheckError;

      for (const item of items) {
        const dbProd = dbProducts?.find((p) => p.slug === item.product.id);
        if (!dbProd) {
          throw new Error(`Product ${item.product.name} not found`);
        }
        if (dbProd.stock < item.quantity) {
          toast.error(`Sorry, only ${dbProd.stock} units of ${item.product.name} are left in stock.`);
          setSubmitting(false);
          return;
        }
      }

      // 2. Create Order in database
      const created = await createOrder({
        customer_name: form.name,
        phone: form.phone,
        alt_phone: form.altPhone,
        address: form.address,
        landmark: form.landmark,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        notes: form.notes,
        items: orderItems,
        subtotal,
        discount,
        shipping,
        total,
      });

      const orderNo = created.order_no;

      // 3. Client-side stock deduction (runs in parallel with trigger for immediate local updates)
      for (const item of items) {
        const dbProd = dbProducts?.find((p) => p.slug === item.product.id);
        const currentStock = dbProd ? dbProd.stock : item.product.stock;
        const newStock = Math.max(0, currentStock - item.quantity);
        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("slug", item.product.id);
      }

      const lines = [
        `Hello, I want to place a new order${orderNo ? ` — *${orderNo}*` : ""}.`,
        "",
        `*Customer Name:* ${form.name}`,
        `*Phone:* ${form.phone}${form.altPhone ? ` / ${form.altPhone}` : ""}`,
        `*Address:* ${form.address}${form.landmark ? `, ${form.landmark}` : ""}, ${form.city}, ${form.state} - ${form.pincode}`,
        form.notes ? `*Notes:* ${form.notes}` : "",
        "",
        "*Products:*",
        ...items.map((it, i) =>
          `${i + 1}. ${it.product.name}\n   ${it.product.flavor} • ${it.product.weight}\n   Qty: ${it.quantity} × ₹${it.product.price} = ₹${it.product.price * it.quantity}`,
        ),
        "",
        `*Subtotal:* ₹${subtotal.toLocaleString("en-IN")}`,
        `*Discount:* ₹${discount.toLocaleString("en-IN")}`,
        `*Shipping:* ${shipping === 0 ? "FREE" : `₹${shipping}`}`,
        `*Grand Total:* ₹${total.toLocaleString("en-IN")}`,
        "",
        "Please confirm my order.",
      ].filter(Boolean).join("\n");

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines)}`;
      window.open(url, "_blank", "noopener,noreferrer");

      clear();
      setSubmitting(false);
      toast.success(orderNo ? `Order ${orderNo} placed & sent to WhatsApp!` : "Order sent to WhatsApp!");
      
      // Navigate to checkout confirmation page
      navigate({ to: "/order-confirmation/$id", params: { id: created.id } });
    } catch (err) {
      console.error(err);
      toast.error("Could not complete order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link to="/products" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl font-black">
          Checkout
        </motion.h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px]">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={submit}
            className="rounded-2xl border border-border bg-gradient-card p-6"
          >
            <h2 className="font-display text-lg font-bold">Delivery Details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name*" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Phone*" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
              <Field label="Alternate Phone" value={form.altPhone} onChange={(v) => setForm({ ...form, altPhone: v })} type="tel" />
              <Field label="Pincode*" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} />
              <Field label="Address*" value={form.address} onChange={(v) => setForm({ ...form, address: v })} full />
              <Field label="Landmark" value={form.landmark} onChange={(v) => setForm({ ...form, landmark: v })} />
              <Field label="City*" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <Field label="State*" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
              <Field label="Order Notes" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} full textarea />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-neon px-6 py-4 font-display text-base font-black text-neon-foreground shadow-neon transition-transform hover:scale-[1.01] disabled:opacity-70"
            >
              <MessageCircle className="h-5 w-5" />
              {submitting ? "Saving order..." : "Place Order via WhatsApp"}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Your order is saved to our system and opens in WhatsApp for confirmation.
            </p>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-border bg-gradient-card p-6"
          >
            <h2 className="font-display text-lg font-bold">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map((it) => (
                <li key={it.product.id} className="flex gap-3">
                  <img src={it.product.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-sm font-bold">{it.product.name}</div>
                    <div className="text-[11px] text-muted-foreground">{it.product.weight} × {it.quantity}</div>
                  </div>
                  <div className="text-sm font-bold">₹{(it.product.price * it.quantity).toLocaleString("en-IN")}</div>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <Row label="Subtotal" value={`₹${subtotal.toLocaleString("en-IN")}`} />
              <Row label="Discount" value={`- ₹${discount.toLocaleString("en-IN")}`} accent />
              <Row label="Shipping" value={shipping === 0 ? "FREE" : `₹${shipping}`} accent={shipping === 0} />
              <div className="my-2 border-t border-border" />
              <Row label="Total" value={`₹${total.toLocaleString("en-IN")}`} bold />
            </div>
          </motion.aside>
        </div>
      </section>
    </Layout>
  );
}

function Field({
  label, value, onChange, type = "text", full, textarea,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; full?: boolean; textarea?: boolean; }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-neon"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-neon"
        />
      )}
    </label>
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
