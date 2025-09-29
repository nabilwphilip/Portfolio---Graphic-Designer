-- Add images column to works table to support multiple images
ALTER TABLE public.works ADD COLUMN images TEXT[];

-- Set default empty array for existing records
UPDATE public.works SET images = '{}' WHERE images IS NULL;