import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-card p-8 text-center sm:p-12"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-40 blur-2xl"
          style={{
            background:
              "radial-gradient(600px 200px at 50% 0%, oklch(0.88 0.28 135 / 0.35), transparent 70%)",
          }}
        />
        <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          Get <span className="text-gradient-gold">10% Off</span> Your First Order
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Join 50,000+ athletes. Exclusive drops, offers and training tips in your inbox.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@")) return toast.error("Please enter a valid email");
            toast.success("Welcome to the crew! Check your inbox.");
            setEmail("");
          }}
          className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-neon"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-neon px-6 py-3 text-sm font-bold text-neon-foreground shadow-neon transition-transform hover:scale-[1.03]"
          >
            <Send className="h-4 w-4" />
            Subscribe
          </button>
        </form>
      </motion.div>
    </section>
  );
}
