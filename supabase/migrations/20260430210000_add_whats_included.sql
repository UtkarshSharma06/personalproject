ALTER TABLE store_products ADD COLUMN IF NOT EXISTS whats_included text[] DEFAULT '{}';
