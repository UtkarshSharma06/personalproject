// Run this migration in your Supabase SQL Editor to enable section-based tests
// Go to: https://supabase.com/dashboard/project/jyjhpqtqbwtxxgijxetq/sql/new

const migrationSQL = `
-- Migration: Add section-based test support
-- Date: 2026-01-27
-- Purpose: Enable section-based mock tests with forward-only navigation

-- 1. Add section tracking fields to tests table
ALTER TABLE public.tests
ADD COLUMN IF NOT EXISTS is_sectioned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS current_section INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS sections_completed INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN IF NOT EXISTS section_start_times JSONB DEFAULT '{}'::JSONB;

-- 2. Add section metadata to questions table
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS section_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS section_name TEXT;

-- 3. Add comments for documentation
COMMENT ON COLUMN public.tests.is_sectioned IS 'Whether this test uses section-based navigation (forward-only)';
COMMENT ON COLUMN public.tests.current_section IS 'Current active section number (1-indexed)';
COMMENT ON COLUMN public.tests.sections_completed IS 'Array of completed section numbers';
COMMENT ON COLUMN public.tests.section_start_times IS 'JSON object mapping section numbers to start timestamps';

COMMENT ON COLUMN public.questions.section_number IS 'Section this question belongs to (1-indexed)';
COMMENT ON COLUMN public.questions.section_name IS 'Name of section (e.g., "Biology", "Mathematics")';
`;

console.log('Copy and run this SQL in your Supabase SQL Editor:');
console.log(migrationSQL);
