import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
}

const BrandCarousel = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching brands:", error);
        return;
      }

      setBrands(data || []);
    };

    fetchBrands();
  }, []);

  // Create enough duplicates for seamless infinite scroll
  const duplicatedBrands = brands.length > 0 ? 
    [...brands, ...brands] : [];

  if (brands.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden py-8">
      <div className="flex space-x-8 animate-scroll-medium hover:animation-pause">
        {duplicatedBrands.map((brand, index) => (
          <div
            key={`${brand.id}-${index}`}
            className="flex-shrink-0 w-32 h-16 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-glow"
            onMouseEnter={(e) => {
              const scrollContainer = e.currentTarget.closest('.animate-scroll-medium') as HTMLElement;
              if (scrollContainer) {
                scrollContainer.style.animationPlayState = 'paused';
              }
            }}
            onMouseLeave={(e) => {
              const scrollContainer = e.currentTarget.closest('.animate-scroll-medium') as HTMLElement;
              if (scrollContainer) {
                scrollContainer.style.animationPlayState = 'running';
              }
            }}
          >
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="max-w-24 max-h-12 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                {brand.name}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Gradient overlays for smooth infinite effect */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default BrandCarousel;