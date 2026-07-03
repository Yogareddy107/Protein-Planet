-- 1. Add status_history column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status_history JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 2. Populate status_history for existing orders
UPDATE public.orders
SET status_history = jsonb_build_array(jsonb_build_object(
  'status', status,
  'timestamp', created_at
))
WHERE jsonb_array_length(status_history) = 0;

-- 3. Create function to handle status history updates
CREATE OR REPLACE FUNCTION public.handle_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status_history IS NULL OR jsonb_array_length(NEW.status_history) = 0 THEN
      NEW.status_history = jsonb_build_array(jsonb_build_object(
        'status', NEW.status,
        'timestamp', now()
      ));
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      NEW.status_history = COALESCE(OLD.status_history, '[]'::jsonb) || jsonb_build_object(
        'status', NEW.status,
        'timestamp', now()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger for status history
DROP TRIGGER IF EXISTS trg_order_status_history ON public.orders;
CREATE TRIGGER trg_order_status_history
BEFORE INSERT OR UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_status_history();

-- 5. Create function to deduct product stock upon order insertion
CREATE OR REPLACE FUNCTION public.deduct_stock_on_order()
RETURNS TRIGGER AS $$
DECLARE
  item jsonb;
  item_slug text;
  qty int;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
    item_slug := item->>'slug';
    qty := (item->>'quantity')::int;
    
    -- Decrement stock by the ordered quantity
    UPDATE public.products
    SET stock = GREATEST(0, stock - qty)
    WHERE slug = item_slug;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for stock deduction
DROP TRIGGER IF EXISTS trg_deduct_stock_on_order ON public.orders;
CREATE TRIGGER trg_deduct_stock_on_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.deduct_stock_on_order();

-- 7. Update default owner WhatsApp in settings table seed (if present)
UPDATE public.settings
SET owner_whatsapp = '918106002793'
WHERE id = 1;
