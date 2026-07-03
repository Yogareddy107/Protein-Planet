import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Tag } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero noise">
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Stylish background image texture */}
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity filter brightness-75 contrast-125"
        />
        {/* Animated HD Background Mesh Blobs */}
        <div className="absolute inset-0 overflow-hidden opacity-30 sm:opacity-40">
          {/* Blob 1 */}
          <motion.div
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -50, 30, 0],
              scale: [1, 1.15, 0.9, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[-10%] top-[-10%] h-[80%] w-[60%] rounded-full bg-gradient-to-br from-neon/30 to-transparent blur-[120px]"
          />
          {/* Blob 2 */}
          <motion.div
            animate={{
              x: [0, -60, 40, 0],
              y: [0, 40, -40, 0],
              scale: [1, 0.85, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[-10%] bottom-[-10%] h-[90%] w-[70%] rounded-full bg-gradient-to-tr from-gold/25 to-transparent blur-[140px]"
          />
          {/* Blob 3 */}
          <motion.div
            animate={{
              x: [0, 50, -40, 0],
              y: [0, 30, 50, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[20%] top-[20%] h-[70%] w-[50%] rounded-full bg-gradient-to-r from-neon/15 via-gold/15 to-transparent blur-[130px]"
          />
        </div>

        {/* Floating particles */}
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-neon/60"
            initial={{
              x: `${(i * 137) % 100}%`,
              y: `${(i * 79) % 100}%`,
              opacity: 0.2,
            }}
            animate={{
              y: [`${(i * 79) % 100}%`, `${((i * 79) % 100) - 20}%`, `${(i * 79) % 100}%`],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-36 lg:py-44 flex flex-col items-center text-center">
        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-neon" />
            100% Authentic • Lab Tested • Fast Shipping
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 font-display text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Build Your <br className="sm:hidden" />
            <span className="text-gradient-gold">Dream Physique</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed"
          >
            Premium Whey Protein • Mass Gainers • Creatine • BCAA. Fuel every rep with
            supplements engineered for serious athletes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
            >
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/offers"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-8 py-3.5 text-sm font-bold text-foreground backdrop-blur transition hover:border-neon hover:text-neon"
            >
              <Tag className="h-4 w-4" />
              View Offers
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
