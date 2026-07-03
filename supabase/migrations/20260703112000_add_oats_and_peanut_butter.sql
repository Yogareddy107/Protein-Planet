-- Add Oats and Peanut Butter categories if they do not exist
INSERT INTO public.categories (slug, name, icon, sort_order)
VALUES 
  ('oats', 'Oats', '🌾', 9),
  ('peanut-butter', 'Peanut Butter', '🥜', 10)
ON CONFLICT (slug) DO NOTHING;
