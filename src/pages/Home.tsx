import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Briefcase } from "lucide-react";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/ui/hero-section";
import AnimatedCounter from "@/components/ui/animated-counter";
import BrandCarousel from "@/components/ui/brand-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import SEOHelmet from "@/components/seo/SEOHelmet";

interface Statistics {
  happy_clients: number;
  projects_completed: number;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

interface Work {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  featured: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  featured_image_url: string;
  category: string;
  reading_time: number;
}

const Home = () => {
  const [statistics, setStatistics] = useState<Statistics>({ happy_clients: 0, projects_completed: 0 });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [featuredWorks, setFeaturedWorks] = useState<Work[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch statistics
      const { data: statsData, error: statsError } = await supabase
        .from("statistics")
        .select("*");
      
      if (statsError) {
        console.error("Error fetching statistics:", statsError);
        setStatistics({ happy_clients: 0, projects_completed: 0 });
      } else if (statsData && statsData.length > 0) {
        console.log("Statistics data:", statsData); // Debug log
        const stats = statsData.reduce((acc: any, stat) => {
          acc[stat.key] = stat.value;
          return acc;
        }, {});
        console.log("Processed stats:", stats); // Debug log
        const finalStats = { 
          happy_clients: stats.happy_clients || 0, 
          projects_completed: stats.projects_completed || 0 
        };
        console.log("Final stats object:", finalStats); // Debug log
        setStatistics(finalStats);
      } else {
        console.log("No statistics data found"); // Debug log
        setStatistics({ happy_clients: 0, projects_completed: 0 });
      }

      // Fetch top skills
      const { data: skillsData } = await supabase
        .from("skills")
        .select("*")
        .order("level", { ascending: false })
        .limit(6);
      
      if (skillsData) setSkills(skillsData);

      // Fetch featured works
      const { data: worksData } = await supabase
        .from("works")
        .select("*")
        .eq("featured", true)
        .limit(3);
      
      if (worksData) setFeaturedWorks(worksData);

      // Fetch latest blog posts
      const { data: blogsData } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      
      if (blogsData) setLatestBlogs(blogsData);
    };

    fetchData();
  }, []);

  return (
    <>
      <SEOHelmet 
        title="Home"
        description="George William - Professional graphic designer specializing in brand identity, digital design, and creative solutions. Transform your vision into stunning visual experiences."
        keywords="George William, graphic design, brand identity, logo design, digital design, creative studio, portfolio, Egypt graphic designer"
      />
      <Layout>
      {/* Hero Section */}
      <HeroSection background="black">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 tracking-tight">
              Creative{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Graphic Designer
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed font-medium">
              Transforming ideas into stunning visual experiences. I specialize in brand identity, 
              digital design, and creative solutions that make your business stand out.
            </p>
            
            {/* Statistics */}
            <div className="flex flex-wrap gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-1">
                  <AnimatedCounter end={statistics.happy_clients} suffix="+" />
                </div>
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-1">
                  <AnimatedCounter end={statistics.projects_completed} suffix="+" />
                </div>
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Projects Completed</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Link to="/works">
                  View My Work <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative w-full max-w-lg mx-auto">
              {/* Animated Background Elements */}
              <div className="absolute -inset-4">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary-glow/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: "1s" }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              </div>
              
              {/* Main Image Container */}
              <div className="relative">
                {/* Glowing Border */}
                <div className="absolute -inset-1 bg-gradient-primary rounded-full blur-sm opacity-60 animate-pulse"></div>
                
                {/* Image */}
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-full p-2">
                  <img
                    src="/george-uploads/751a451e-54ae-48c5-af1e-4f28a13a9dd0.png"
                    alt="George William - Professional Graphic Designer"
                    className="relative z-10 w-full h-auto rounded-full shadow-2xl border-2 border-primary/30"
                    loading="lazy"
                  />
                </div>
                
                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary-glow rounded-full animate-ping" style={{ animationDelay: "1.5s" }}></div>
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.7s" }}></div>
              </div>
            </div>
          </div>
        </div>
      </HeroSection>

      {/* Brands Carousel */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-muted-foreground">
            Trusted by Amazing Brands
          </h2>
          <BrandCarousel />
        </div>
      </section>

      {/* Skills Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">My Expertise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              I combine creativity with technical skills to deliver exceptional design solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {skills.map((skill) => (
              <Card key={skill.id} className="p-6 hover:shadow-glow transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <Badge variant="secondary">{skill.level}%</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline">
              <Link to="/about">View All Skills</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of my best work showcasing creativity and technical excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
            {featuredWorks.map((work) => (
              <Card key={work.id} className="group overflow-hidden hover:shadow-glow transition-all duration-300 cursor-pointer">
                <Link to={`/works/${work.id}`} className="block">
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={work.image_url || "/api/placeholder/400/300"}
                        alt={work.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4 md:p-6">
                    <Badge className="mb-2">{work.category}</Badge>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{work.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{work.description}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild>
              <Link to="/works">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Insights</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thoughts, tutorials, and insights from the world of design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {latestBlogs.map((blog) => (
              <Card key={blog.id} className="group hover:shadow-glow transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={blog.featured_image_url || "/api/placeholder/400/200"}
                    alt={blog.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <Badge variant="outline">{blog.category}</Badge>
                    <span>•</span>
                    <span>{blog.reading_time} min read</span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">{blog.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline">
              <Link to="/blog">
                Read More Articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
    </>
  );
};

export default Home;