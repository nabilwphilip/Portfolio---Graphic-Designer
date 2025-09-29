import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Tag, X, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching project:", error);
        navigate("/works");
        return;
      }

      if (!data) {
        navigate("/works");
        return;
      }

      setProject({
        ...data,
        images: data.images || []
      });
      setLoading(false);
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <SEOHelmet 
          title="Project Details"
          description="View detailed information about George William's creative project"
          keywords="George William project, graphic design details, portfolio showcase"
        />
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </Layout>
      </>
    );
  }

  if (!project) return null;

  // Combine main image with additional images
  const allImages = project.image_url 
    ? [project.image_url, ...(project.images || [])]
    : (project.images || []);

  const openLightbox = (index: number) => {
    setLightboxImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToPrevious = () => {
    setLightboxImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setLightboxImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <SEOHelmet 
        title={`${project.title} - Project Details`}
        description={`Explore ${project.title} by George William. ${project.description?.substring(0, 150)}...`}
        keywords={`George William, ${project.title}, ${project.category}, graphic design, ${project.technologies?.join(', ')}`}
      />
      <Layout>
        {/* Back Navigation */}
        <div className="py-8 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/works" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Portfolio
              </Link>
            </Button>
          </div>
        </div>

        {/* Project Header */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Project Images Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-lg cursor-pointer" onClick={() => openLightbox(selectedImageIndex)}>
                  <div className="aspect-[4/3] md:aspect-[3/2] overflow-hidden">
                    <img
                      src={allImages[selectedImageIndex] || "/api/placeholder/600/400"}
                      alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Badge className="bg-primary/90 hover:bg-primary">
                      Click to View Full Size
                    </Badge>
                  </div>
                </div>

                {/* Image Thumbnails */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative overflow-hidden rounded-md border-2 transition-all duration-200 ${
                          selectedImageIndex === index 
                            ? 'border-primary shadow-glow' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={image}
                            alt={`${project.title} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="space-y-6">
                <div>
                  {project.featured && (
                    <Badge className="mb-3 bg-primary">Featured Project</Badge>
                  )}
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                    {project.title}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Project Meta */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-primary" />
                      <span className="font-medium">Category:</span>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>

                    {project.client && (
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-medium">Client:</span>
                        <span className="text-muted-foreground">{project.client}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-medium">Created:</span>
                      <span className="text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {project.project_url && (
                    <Button asChild className="flex-1">
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live Project
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button variant="outline" asChild className="flex-1">
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Gallery */}
        {allImages.length > 1 && (
          <section className="py-16 bg-gradient-accent">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">
                Project <span className="bg-gradient-primary bg-clip-text text-transparent">Gallery</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {allImages.map((image, index) => (
                  <Card key={index} className="group overflow-hidden hover:shadow-glow transition-all duration-300">
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={image}
                          alt={`${project.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <button
                        onClick={() => openLightbox(index)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Badge className="bg-primary/90 hover:bg-primary">
                          View Full Size
                        </Badge>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Lightbox Modal */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none overflow-hidden">
            <DialogTitle className="sr-only">
              {project.title} - Image Gallery
            </DialogTitle>
            <DialogDescription className="sr-only">
              Full size view of project images. Use arrow keys or swipe to navigate between images.
            </DialogDescription>
            
            <div 
              className="relative w-full h-full flex items-center justify-center touch-pan-x"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                e.currentTarget.dataset.startX = touch.clientX.toString();
              }}
              onTouchEnd={(e) => {
                const touch = e.changedTouches[0];
                const startX = parseFloat(e.currentTarget.dataset.startX || '0');
                const deltaX = touch.clientX - startX;
                
                if (Math.abs(deltaX) > 50) { // Minimum swipe distance
                  if (deltaX > 0) {
                    goToPrevious();
                  } else {
                    goToNext();
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') goToPrevious();
                if (e.key === 'ArrowRight') goToNext();
                if (e.key === 'Escape') closeLightbox();
              }}
              tabIndex={0}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/10 bg-black/50 rounded-full"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation Buttons */}
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 bg-black/50 rounded-full"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 bg-black/50 rounded-full"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Main Image Container */}
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={allImages[lightboxImageIndex]}
                  alt={`${project.title} - Full Size Image ${lightboxImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain select-none w-auto h-auto"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  draggable={false}
                  loading="eager"
                />
              </div>

              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {lightboxImageIndex + 1} / {allImages.length}
                </div>
              )}

              {/* Mobile swipe indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 text-white/80 text-xs bg-black/50 px-3 py-1 rounded-full md:hidden">
                Swipe left or right to navigate
              </div>

              {/* Thumbnail Navigation - Desktop only */}
              {allImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex gap-2 max-w-lg overflow-x-auto scrollbar-hide bg-black/50 p-2 rounded-lg">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setLightboxImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                        lightboxImageIndex === index 
                          ? 'border-primary ring-2 ring-primary/50' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Layout>
    </>
  );
};

export default ProjectDetail;