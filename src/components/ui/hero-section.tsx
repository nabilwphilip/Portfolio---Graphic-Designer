import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  children: ReactNode;
  className?: string;
  background?: "gradient" | "dark" | "accent" | "black";
}

const HeroSection = ({ children, className, background = "gradient" }: HeroSectionProps) => {
  const backgroundClasses = {
    gradient: "bg-gradient-primary",
    dark: "bg-background",
    accent: "bg-gradient-accent",
    black: "bg-black"
  };

  return (
    <section className={cn(
      "relative py-20 sm:py-32 overflow-hidden",
      backgroundClasses[background],
      className
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default HeroSection;