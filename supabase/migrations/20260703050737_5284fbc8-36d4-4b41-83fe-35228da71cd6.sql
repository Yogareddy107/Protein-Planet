
CREATE POLICY "shop images public read" ON storage.objects FOR SELECT
  USING (bucket_id IN ('product-images','category-images','banner-images'));
CREATE POLICY "shop images public insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('product-images','category-images','banner-images'));
CREATE POLICY "shop images public update" ON storage.objects FOR UPDATE
  USING (bucket_id IN ('product-images','category-images','banner-images'));
CREATE POLICY "shop images public delete" ON storage.objects FOR DELETE
  USING (bucket_id IN ('product-images','category-images','banner-images'));
