import { useEffect, useState } from "react";
import { Calendar, MapPin, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/ui/hero-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import BrandCarousel from "@/components/ui/brand-carousel";
import SEOHelmet from "@/components/seo/SEOHelmet";

interface Education {
  id: string;
  degree: string;
  institution: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  location: string | null;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string | null;
}

const About = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch education
      const { data: educationData } = await supabase
        .from("education")
        .select("*")
        .order("start_date", { ascending: false });
      
      if (educationData) setEducation(educationData);

      // Fetch experience
      const { data: experienceData } = await supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false });
      
      if (experienceData) setExperience(experienceData);

      // Fetch skills
      const { data: skillsData } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true });
      
      if (skillsData) setSkills(skillsData);
    };

    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <>
      <SEOHelmet 
        title="About George William"
        description="Learn about George William, a passionate graphic designer with 5+ years of experience in brand identity, digital design, and creative solutions. Based in Mansoura, Egypt."
        keywords="George William, about, graphic designer, brand identity, creative solutions, Egypt, portfolio, experience"
      />
      <Layout>
      {/* Hero Section */}
      <HeroSection background="dark">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            About{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              George William
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A passionate graphic designer with a keen eye for detail and a love for creating 
            visual stories that resonate with audiences. I believe great design has the power 
            to transform businesses and connect people.
          </p>
        </div>
      </HeroSection>

      {/* About Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">My Journey</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  With over 5 years of experience in graphic design, I've had the privilege 
                  of working with diverse clients across various industries. My journey began 
                  with a simple fascination for visual communication and has evolved into a 
                  passion for creating meaningful design solutions.
                </p>
                <p>
                  I specialize in brand identity, digital design, and print media. My approach 
                  combines strategic thinking with creative execution, ensuring that every 
                  design not only looks beautiful but also serves its intended purpose effectively.
                </p>
                <p>
                  When I'm not designing, you can find me exploring new design trends, 
                  experimenting with new tools, or sharing knowledge with the design community 
                  through workshops and online content.
                </p>
              </div>
            </div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Profile Image with amazing design */}
              <div className="relative group">
                {/* Gradient background with glow */}
                <div className="absolute -inset-4 bg-gradient-primary rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                {/* Main image container */}
                <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden bg-gradient-primary p-1 shadow-2xl">
                  <div className="w-full h-full bg-black rounded-[1.4rem] overflow-hidden">
                    <img 
                      src="/george-uploads/c5e39cec-6e62-4494-8310-7d73916fda3d.png" 
                      alt="George William - Creative Graphic Designer" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Floating elements */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute top-4 right-4 w-8 h-8 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm"
                      >
                        <Award className="h-4 w-4 text-white" />
                      </motion.div>
                      
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: 1 
                        }}
                        className="absolute bottom-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium"
                      >
                        5+ Years Experience
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-accent rounded-full"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-secondary rounded-full"></div>
                <div className="absolute top-1/2 -left-6 w-2 h-2 bg-primary rounded-full"></div>
                <div className="absolute top-1/4 -right-4 w-3 h-3 bg-primary/60 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Education</h2>
          <div className="max-w-4xl mx-auto">
            {education.map((edu) => (
              <Card key={edu.id} className="mb-6 hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{edu.degree}</h3>
                      <p className="text-primary font-medium">{edu.institution}</p>
                    </div>
                    <div className="flex items-center text-muted-foreground mt-2 md:mt-0">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : "Present"}
                      </span>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-muted-foreground">{edu.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Work Experience</h2>
          <div className="max-w-4xl mx-auto">
            {experience.map((exp) => (
              <Card key={exp.id} className="mb-6 hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{exp.title}</h3>
                      <p className="text-primary font-medium mb-2">{exp.company}</p>
                      {exp.location && (
                        <div className="flex items-center text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-muted-foreground mt-2 md:mt-0">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                      </span>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-muted-foreground">{exp.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Skills & Expertise</h2>
          <div className="max-w-6xl mx-auto">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 text-center">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categorySkills.map((skill) => (
                    <Card key={skill.id} className="p-6 hover:shadow-glow transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{skill.name}</h4>
                          <Badge variant="secondary">{skill.level}%</Badge>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by Amazing Brands */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by <span className="bg-gradient-primary bg-clip-text text-transparent">Amazing Brands</span>
          </h2>
          <BrandCarousel />
        </div>
      </section>
    </Layout>
    </>
  );
};

export default About;