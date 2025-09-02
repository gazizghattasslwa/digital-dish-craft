-- Add menu_template column to restaurants for selectable public menu templates
ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS menu_template text NOT NULL DEFAULT 'classic';

-- Optional: ensure existing rows have a non-null value (covered by default)

-- No changes to RLS needed; column is non-sensitive and governed by existing policies.