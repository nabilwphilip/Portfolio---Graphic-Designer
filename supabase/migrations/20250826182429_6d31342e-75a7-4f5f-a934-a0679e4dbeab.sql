-- Create storage bucket for brand logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for brand logos bucket
CREATE POLICY "Public can view brand logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'brand-logos');

CREATE POLICY "Admin can upload brand logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'brand-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin can update brand logos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'brand-logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin can delete brand logos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'brand-logos' 
  AND auth.role() = 'authenticated'
);