-- Add SEO and FAQ columns to store_products
ALTER TABLE store_products 
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS seo_keywords text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS canonical_url text;

-- Add comment for documentation
COMMENT ON COLUMN store_products.faqs IS 'Array of objects with {question, answer} for SEO Schema.org injection';
