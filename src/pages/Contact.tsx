import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/ui/hero-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SEOHelmet from "@/components/seo/SEOHelmet";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert([formData]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast({
        title: "Message sent successfully!",
        description: "I'll get back to you as soon as possible.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error sending message",
        description: "Please try again or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "Georgewilliam2980@gmail.com",
      href: "mailto:Georgewilliam2980@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+20 103 301 3469",
      href: "tel:+201033013469",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Mansoura, Egypt",
      href: "https://maps.google.com/?q=Mansoura,+Egypt",
    },
  ];

  return (
    <>
      <SEOHelmet 
        title="Contact George William"
        description="Get in touch with George William for your graphic design projects. Based in Mansoura, Egypt. Available for brand identity, digital design, and creative solutions."
        keywords="contact George William, graphic design services, brand identity, design consultation, Egypt graphic designer"
      />
      <Layout>
      {/* Hero Section */}
      <HeroSection background="dark">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Let's Work{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Together
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Have a project in mind? I'd love to hear about it. Let's discuss how 
            I can help bring your vision to life through creative design solutions.
          </p>
        </div>
      </HeroSection>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  I'm always excited to work on new projects and collaborate with amazing people. 
                  Whether you need a complete brand identity, digital design work, or have questions 
                  about my services, don't hesitate to reach out.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-primary p-3 rounded-lg">
                          <info.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{info.label}</h3>
                          <a
                            href={info.href}
                            target={info.href.startsWith("http") ? "_blank" : "_self"}
                            rel={info.href.startsWith("http") ? "noopener noreferrer" : ""}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Availability */}
              <Card className="bg-gradient-accent border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Current Availability</h3>
                  <p className="text-muted-foreground">
                    I'm currently accepting new projects for Q2 2024. 
                    Typical project timelines range from 2-8 weeks depending on scope.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-elegant">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. I'll get back to you within 24 hours.
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold mb-6">Send Me a Message</h3>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              className="focus:border-primary focus:ring-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="focus:border-primary focus:ring-primary"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="e.g., Brand Identity Project"
                            className="focus:border-primary focus:ring-primary"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            required
                            rows={6}
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell me about your project, timeline, and any specific requirements..."
                            className="focus:border-primary focus:ring-primary resize-none"
                          />
                        </div>
                        
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                          size="lg"
                        >
                          {isSubmitting ? (
                            "Sending..."
                          ) : (
                            <>
                              Send Message <Send className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
    </>
  );
};

export default Contact;