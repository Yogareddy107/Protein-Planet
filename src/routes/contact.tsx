import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { OWNER_WHATSAPP } from "@/data/products";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Protein Planet" },
      { name: "description", content: "Get in touch with the Protein Planet team." },
    ],
  }),
});

function ContactPage() {
  const [msg, setMsg] = useState("");
  const send = () => {
    if (!msg.trim()) return toast.error("Type a message first");
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  return (
    <Layout>
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-neon">Get in touch</div>
          <h1 className="mt-1 font-display text-4xl font-black">Contact Us</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Questions about a product, order, or nutrition? We're here 7 days a week.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              { icon: Phone, label: "+91 8106002793" },
            ].map((i, k) => (
              <li key={k} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                <i.icon className="h-5 w-5 text-neon" />
                <span className="text-sm">{i.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-border bg-gradient-card p-6"
        >
          <h2 className="font-display text-lg font-bold">Send a WhatsApp</h2>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={6}
            placeholder="Tell us how we can help..."
            className="mt-4 w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-neon"
          />
          <button
            onClick={send}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-neon px-6 py-3 text-sm font-bold text-neon-foreground shadow-neon"
          >
            <MessageCircle className="h-4 w-4" /> Send Message
          </button>
        </motion.div>
      </section>
    </Layout>
  );
}
