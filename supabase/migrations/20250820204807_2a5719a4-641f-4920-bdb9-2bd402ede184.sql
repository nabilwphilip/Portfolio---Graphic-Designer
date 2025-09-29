-- Create tables for the portfolio website

-- Skills table
CREATE TABLE public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER CHECK (level >= 0 AND level <= 100) NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience table
CREATE TABLE public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table (for the brands carousel)
CREATE TABLE public.brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Works/Projects table
CREATE TABLE public.works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT NOT NULL,
  technologies TEXT[], -- Array of technologies used
  client TEXT,
  project_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  category TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  reading_time INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client testimonials/reviews table
CREATE TABLE public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_position TEXT,
  client_company TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  avatar_url TEXT,
  project_id UUID REFERENCES public.works(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Statistics table for homepage
CREATE TABLE public.statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public read access for portfolio data)
CREATE POLICY "Public can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public can view education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public can view experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public can view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Public can view works" ON public.works FOR SELECT USING (true);
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public can view statistics" ON public.statistics FOR SELECT USING (true);

-- Contact submissions - allow anyone to insert, but restrict reading
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Admin policies (we'll implement proper admin authentication later)
CREATE POLICY "Admin can manage skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage education" ON public.education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage experience" ON public.experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage brands" ON public.brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage works" ON public.works FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage blog posts" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can view contact submissions" ON public.contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage statistics" ON public.statistics FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON public.experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON public.works FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON public.statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial data
INSERT INTO public.statistics (key, value, label, icon) VALUES
('happy_clients', 50, 'Happy Clients', 'users'),
('projects_completed', 125, 'Projects Completed', 'briefcase');

-- Insert some sample data for development
INSERT INTO public.skills (name, level, category, icon) VALUES
('Adobe Photoshop', 95, 'Design Software', 'palette'),
('Adobe Illustrator', 90, 'Design Software', 'pen-tool'),
('Figma', 85, 'Design Software', 'figma'),
('Branding', 90, 'Design Skills', 'award'),
('UI/UX Design', 85, 'Design Skills', 'layout'),
('Print Design', 88, 'Design Skills', 'printer');

INSERT INTO public.education (degree, institution, start_date, end_date, description) VALUES
('Bachelor of Fine Arts in Graphic Design', 'Art Institute', '2018-09-01', '2022-05-15', 'Comprehensive study in visual communication, typography, and brand identity development.');

INSERT INTO public.experience (title, company, start_date, end_date, description, location) VALUES
('Senior Graphic Designer', 'Creative Agency', '2022-06-01', NULL, 'Lead designer for major brand campaigns, specializing in visual identity and digital design solutions.', 'New York, NY'),
('Graphic Design Intern', 'Design Studio', '2021-01-01', '2022-05-30', 'Assisted in various design projects including logo design, print materials, and social media graphics.', 'New York, NY');

INSERT INTO public.brands (name, logo_url) VALUES
('Nike', '/api/placeholder/100/50'),
('Apple', '/api/placeholder/100/50'),
('Google', '/api/placeholder/100/50'),
('Microsoft', '/api/placeholder/100/50'),
('Adobe', '/api/placeholder/100/50');

INSERT INTO public.testimonials (client_name, client_position, client_company, content, rating, featured) VALUES
('Sarah Johnson', 'Marketing Director', 'Tech Innovators', 'George delivered exceptional design work that exceeded our expectations. His attention to detail and creative vision transformed our brand identity.', 5, true),
('Mike Chen', 'CEO', 'StartupCo', 'Working with George was a fantastic experience. He understood our vision perfectly and created designs that truly represent our company values.', 5, true);