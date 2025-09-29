import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Monitor, Filter } from "lucide-react";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/ui/hero-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import SEOHelmet from "@/components/seo/SEOHelmet";

interface Work {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  images: string[] | null;
  category: string;
  technologies: string[];
  client: string | null;
  project_url: string | null;
  github_url: string | null;
  featured: boolean;
  created_at: string;
}

const Works = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<Work[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching works:", error);
        setLoading(false);
        return;
      }

      // Handle existing works that might not have images array
      const worksWithImages = (data || []).map(work => ({
        ...work,
        images: work.images || []
      }));

      setWorks(worksWithImages);
      setFilteredWorks(worksWithImages);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map(work => work.category) || [])];
      setCategories(uniqueCategories);
      setLoading(false);
    };

    fetchWorks();
  }, []);

  useEffect(() => {
    let filtered = works;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        work =>
          work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          work.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          work.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(work => work.category === selectedCategory);
    }

    setFilteredWorks(filtered);
  }, [works, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <>
        <SEOHelmet 
          title="Portfolio & Creative Works"
          description="Explore George William's portfolio featuring brand identity projects, digital designs, and creative solutions. See the latest graphic design work and client projects."
          keywords="George William portfolio, graphic design portfolio, brand identity projects, creative works, design showcase"
        />
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SEOHelmet 
        title="Portfolio & Creative Works"
        description="Explore George William's portfolio featuring brand identity projects, digital designs, and creative solutions. See the latest graphic design work and client projects."
        keywords="George William portfolio, graphic design portfolio, brand identity projects, creative works, design showcase"
      />
      <Layout>
      {/* Hero Section */}
      <HeroSection background="dark">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            My{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Creative Works
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A showcase of my creative projects, from brand identities to digital experiences. 
            Each project represents a unique challenge and creative solution.
          </p>
        </div>
      </HeroSection>

      {/* Filters */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredWorks.length} of {works.length} projects
            </div>
          </div>
        </div>
      </section>

      {/* Works Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredWorks.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredWorks.map((work) => (
                <Card key={work.id} className="group overflow-hidden hover:shadow-glow transition-all duration-300 cursor-pointer">
                  <Link to={`/works/${work.id}`} className="block">
                    <div className="relative overflow-hidden">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={work.image_url || "/api/placeholder/400/300"}
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                          {work.project_url && (
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a href={work.project_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {work.github_url && (
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a href={work.github_url} target="_blank" rel="noopener noreferrer">
                                <Monitor className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      {work.featured && (
                        <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{work.category}</Badge>
                        {work.client && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{work.client}</span>
                          </>
                        )}
                      </div>
                      
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {work.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {work.description}
                      </p>
                      
                      {work.technologies && work.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {work.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {work.technologies.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{work.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      </Layout>
    </>
  );
};

export default Works;