-- Add slug column to courses table
ALTER TABLE courses ADD COLUMN slug TEXT UNIQUE;

-- Allow read access to the slug column
-- (Assuming RLS is enabled and allows SELECT on the table, it automatically covers the new column)

-- Note: We do not add a NOT NULL constraint immediately because existing rows might not have a slug.
-- Slugs can be generated based on the course title if missing:
-- UPDATE courses SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
