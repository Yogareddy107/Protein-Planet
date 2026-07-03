
-- Enums
CREATE TYPE public.order_status AS ENUM ('Pending', 'Confirmed', 'Delivered', 'Cancelled');

-- Updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories all read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories all write" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Protein Planet',
  category_slug TEXT NOT NULL,
  flavor TEXT DEFAULT '',
  weight TEXT DEFAULT '',
  mrp NUMERIC NOT NULL DEFAULT 0,
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  rating NUMERIC NOT NULL DEFAULT 4.7,
  reviews INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  badges TEXT[] NOT NULL DEFAULT '{}',
  description TEXT DEFAULT '',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  ingredients TEXT DEFAULT '',
  nutrition JSONB NOT NULL DEFAULT '[]'::jsonb,
  usage TEXT DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products all read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products all write" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- OFFERS
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  image_url TEXT,
  discount_percent INT DEFAULT 0,
  link TEXT DEFAULT '/products',
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO anon, authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers all read" ON public.offers FOR SELECT USING (true);
CREATE POLICY "offers all write" ON public.offers FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_offers_updated BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BANNERS
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  image_url TEXT,
  link TEXT DEFAULT '/products',
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO anon, authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners all read" ON public.banners FOR SELECT USING (true);
CREATE POLICY "banners all write" ON public.banners FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_banners_updated BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SETTINGS (single row)
CREATE TABLE public.settings (
  id INT PRIMARY KEY DEFAULT 1,
  store_name TEXT NOT NULL DEFAULT 'Protein Planet',
  owner_whatsapp TEXT NOT NULL DEFAULT '919999999999',
  free_shipping_above NUMERIC NOT NULL DEFAULT 1499,
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  youtube TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT settings_singleton CHECK (id = 1)
);
GRANT SELECT, INSERT, UPDATE ON public.settings TO anon, authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings all read" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings all write" ON public.settings FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no TEXT UNIQUE NOT NULL DEFAULT ('PP-' || to_char(now(), 'YYMMDD') || '-' || substr(md5(random()::text), 1, 6)),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  alt_phone TEXT DEFAULT '',
  address TEXT NOT NULL,
  landmark TEXT DEFAULT '',
  city TEXT NOT NULL,
  state TEXT DEFAULT '',
  pincode TEXT NOT NULL,
  notes TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  shipping NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'Pending',
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders all read" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders all write" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SEED CATEGORIES
INSERT INTO public.categories (slug, name, icon, sort_order) VALUES
  ('whey-protein', 'Whey Protein', '🥛', 1),
  ('mass-gainer', 'Mass Gainer', '💪', 2),
  ('creatine', 'Creatine', '⚡', 3),
  ('pre-workout', 'Pre Workout', '🔥', 4),
  ('bcaa', 'BCAA', '🧬', 5),
  ('fat-burner', 'Fat Burner', '🔥', 6),
  ('multivitamins', 'Multivitamins', '💊', 7),
  ('accessories', 'Accessories', '🎽', 8);

-- SEED PRODUCTS (image_url null; storefront falls back to bundled placeholder if missing)
INSERT INTO public.products (slug, name, brand, category_slug, flavor, weight, mrp, price, rating, reviews, stock, badges, description, benefits, ingredients, nutrition, usage) VALUES
  ('whey-gold-2kg', 'Gold Standard Whey Isolate', 'Protein Planet', 'whey-protein', 'Double Rich Chocolate', '2 kg', 6499, 4299, 4.8, 1284, 42, ARRAY['bestseller','offer'],
    '24g of ultra-filtered whey protein isolate per scoop with 5.5g BCAA and 4g Glutamine. Instantised for a smooth, no-clump shake every time.',
    ARRAY['Lean muscle growth','Fast post-workout recovery','Low fat & low sugar','Instantised for smooth mixing'],
    'Whey Protein Isolate, Cocoa, Natural & Artificial Flavour, Sunflower Lecithin, Sucralose.',
    '[{"label":"Serving","value":"30 g"},{"label":"Protein","value":"24 g"},{"label":"BCAA","value":"5.5 g"},{"label":"Glutamine","value":"4 g"},{"label":"Carbs","value":"2 g"},{"label":"Fat","value":"1 g"}]'::jsonb,
    'Mix 1 scoop (30g) with 200ml cold water or milk. Consume post-workout or between meals.'),
  ('mass-gainer-3kg', 'Serious Mass Gainer', 'Protein Planet', 'mass-gainer', 'Chocolate Fudge', '3 kg', 4999, 3499, 4.6, 842, 30, ARRAY['new'],
    '1250 kcal per serving with 50g protein and complex carbs for hardgainers looking to build serious size.',
    ARRAY['High calorie formula','50g protein','Complex carbs','Vitamins & minerals'],
    'Maltodextrin, Whey Concentrate, Oats, Cocoa, Vitamin Blend.',
    '[{"label":"Serving","value":"250 g"},{"label":"Calories","value":"1250"},{"label":"Protein","value":"50 g"},{"label":"Carbs","value":"254 g"},{"label":"Fat","value":"4.5 g"}]'::jsonb,
    'Mix 2 scoops with 500ml milk. Take 1-2 servings daily for weight gain.'),
  ('creatine-500g', 'Micronised Creatine Monohydrate', 'Protein Planet', 'creatine', 'Unflavoured', '500 g', 2299, 1499, 4.9, 2103, 88, ARRAY['bestseller'],
    'Pure micronised creatine monohydrate. 3g per scoop for explosive strength, power and lean mass gains.',
    ARRAY['Explosive strength','Faster recovery','Muscle volume','100% pure'],
    '100% Micronised Creatine Monohydrate.',
    '[{"label":"Serving","value":"3 g"},{"label":"Creatine","value":"3 g"}]'::jsonb,
    'Take 1 scoop (3g) daily with water or juice. Loading not required.'),
  ('preworkout-300g', 'Nitro Pre-Workout', 'Protein Planet', 'pre-workout', 'Green Apple Rush', '300 g', 2999, 1999, 4.7, 623, 55, ARRAY['new','offer'],
    'Explosive energy with 200mg caffeine, 3g L-Citrulline and beta-alanine for skin-splitting pumps.',
    ARRAY['Massive pumps','Laser focus','Explosive energy','Endurance boost'],
    'L-Citrulline, Beta-Alanine, Caffeine, Taurine, Vitamin B12.',
    '[{"label":"Serving","value":"10 g"},{"label":"Caffeine","value":"200 mg"},{"label":"L-Citrulline","value":"3 g"},{"label":"Beta-Alanine","value":"2 g"}]'::jsonb,
    'Mix 1 scoop with 250ml water 20-30 minutes before workout.'),
  ('bcaa-400g', 'BCAA 2:1:1 Recovery', 'Protein Planet', 'bcaa', 'Fruit Punch', '400 g', 2499, 1699, 4.5, 412, 60, ARRAY['offer'],
    '7g of BCAA in the optimal 2:1:1 ratio with electrolytes for intra-workout hydration and recovery.',
    ARRAY['Reduce muscle soreness','Preserve lean mass','Improved hydration','Faster recovery'],
    'L-Leucine, L-Isoleucine, L-Valine, Electrolyte Blend.',
    '[{"label":"Serving","value":"13 g"},{"label":"BCAA","value":"7 g"},{"label":"Electrolytes","value":"1 g"}]'::jsonb,
    'Mix 1 scoop with 300ml water. Sip during workout.'),
  ('whey-1kg', 'Advanced Whey Protein', 'Protein Planet', 'whey-protein', 'Vanilla Cream', '1 kg', 3499, 2299, 4.7, 934, 70, ARRAY['bestseller'],
    '22g protein per scoop, ideal for daily lean muscle support.',
    ARRAY['Muscle recovery','Everyday protein','Great taste'],
    'Whey Concentrate, Whey Isolate, Natural Flavour, Sucralose.',
    '[{"label":"Serving","value":"30 g"},{"label":"Protein","value":"22 g"},{"label":"Carbs","value":"3 g"}]'::jsonb,
    '1 scoop with 200ml water post-workout.'),
  ('gainer-1kg', 'Lean Mass Gainer', 'Protein Planet', 'mass-gainer', 'Cookies & Cream', '1 kg', 2499, 1799, 4.4, 288, 40, ARRAY['new'],
    '600 kcal per serving with 30g protein for clean weight gain.',
    ARRAY['Clean calories','30g protein','Great mixability'],
    'Maltodextrin, Whey Blend, Cocoa, Vitamin Mix.',
    '[{"label":"Serving","value":"150 g"},{"label":"Calories","value":"600"},{"label":"Protein","value":"30 g"}]'::jsonb,
    '2 scoops with 400ml milk between meals.'),
  ('pre-250g', 'Focus Pre-Workout Lite', 'Protein Planet', 'pre-workout', 'Blue Raspberry', '250 g', 2299, 1599, 4.6, 174, 34, ARRAY['offer'],
    'Lower-stim pre-workout with 150mg caffeine and clean focus blend.',
    ARRAY['Clean energy','Sharp focus','No crash'],
    'Caffeine, L-Tyrosine, Beta-Alanine.',
    '[{"label":"Serving","value":"8 g"},{"label":"Caffeine","value":"150 mg"}]'::jsonb,
    '1 scoop with 200ml water pre-workout.');

INSERT INTO public.settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
