import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { ProductGrid } from "@/components/ProductGrid";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Reviews } from "@/components/Reviews";
import { FAQ } from "@/components/FAQ";
import { useProducts } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: products = [] } = useProducts();
  const featured = products.filter((p) => p.badges.includes("bestseller"));
  const latest = products.filter((p) => p.badges.includes("new"));
  const offers = products.filter((p) => p.badges.includes("offer"));

  return (
    <Layout>
      <Hero />
      <Categories />
      {featured.length > 0 && <ProductGrid eyebrow="Best Sellers" title="Featured Products" products={featured.slice(0, 4)} />}
      {latest.length > 0 && <ProductGrid eyebrow="Fresh Drops" title="Latest Products" products={latest.slice(0, 4)} />}
      <WhyChooseUs />
      {offers.length > 0 && <ProductGrid eyebrow="Limited" title="Hot Offers" products={offers.slice(0, 4)} />}
      <ProductGrid eyebrow="Everything" title="All Products" products={products} />
      <Reviews />
      <FAQ />
    </Layout>
  );
}
