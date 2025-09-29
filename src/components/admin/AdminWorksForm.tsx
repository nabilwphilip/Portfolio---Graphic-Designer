import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ExternalLink, Github, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Work {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  client: string;
  project_url: string;
  github_url: string;
  image_url: string;
  images: string[]; // Multiple images array
  featured: boolean;
  created_at: string;
}

interface AdminWorksFormProps {
  searchTerm: string;
  onStatsUpdate: () => void;
}

const AdminWorksForm = ({ searchTerm, onStatsUpdate }: AdminWorksFormProps) => {
  const [works, setWorks] = useState<Work[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    technologies: "",
    client: "",
    project_url: "",
    github_url: "",
    image_url: "",
    images: [] as string[],
    featured: false
  });

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      // Handle existing works that might not have images array
      setWorks(data?.map(work => ({
        ...work,
        images: work.images || []
      })) || []);
    } catch (error) {
      console.error("Error fetching works:", error);
      toast({ title: "Error", description: "Failed to fetch works", variant: "destructive" });
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `works/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('brand-logos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('brand-logos')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      toast({ title: "Success", description: `${uploadedUrls.length} image(s) uploaded successfully` });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({ title: "Error", description: "Failed to upload images", variant: "destructive" });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const workData = {
        ...formData,
        technologies: formData.technologies.split(",").map(tech => tech.trim()).filter(Boolean),
        image_url: formData.images[0] || formData.image_url, // Use first uploaded image as main
      };

      let result;
      if (editingWork) {
        result = await supabase
          .from("works")
          .update(workData)
          .eq("id", editingWork.id);
      } else {
        result = await supabase
          .from("works")
          .insert([workData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Work ${editingWork ? "updated" : "created"} successfully`,
      });

      resetForm();
      fetchWorks();
      onStatsUpdate();
    } catch (error) {
      console.error("Error saving work:", error);
      toast({ title: "Error", description: "Failed to save work", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (work: Work) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      description: work.description || "",
      category: work.category,
      technologies: work.technologies?.join(", ") || "",
      client: work.client || "",
      project_url: work.project_url || "",
      github_url: work.github_url || "",
      image_url: work.image_url || "",
      images: work.images || [],
      featured: work.featured
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work?")) return;

    try {
      const { error } = await supabase
        .from("works")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Work deleted successfully" });
      fetchWorks();
      onStatsUpdate();
    } catch (error) {
      console.error("Error deleting work:", error);
      toast({ title: "Error", description: "Failed to delete work", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      technologies: "",
      client: "",
      project_url: "",
      github_url: "",
      image_url: "",
      images: [],
      featured: false
    });
    setEditingWork(null);
    setIsDialogOpen(false);
  };

  const filteredWorks = works.filter(work =>
    work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Works</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingWork(null)} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Work
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingWork ? "Edit Work" : "Create New Work"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies (comma separated)</Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, TypeScript, Tailwind"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_url">Project URL</Label>
                  <Input
                    id="project_url"
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label>Project Images</Label>
                
                {/* Upload Button */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload project images (multiple files supported)
                  </p>
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={uploadingImages}
                  >
                    {uploadingImages ? "Uploading..." : "Choose Images"}
                  </Button>
                </div>

                {/* Image Preview Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(imageUrl)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Fallback URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="image_url">Or paste image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-primary">
                  {isLoading ? "Saving..." : editingWork ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredWorks.map((work) => (
          <Card key={work.id} className="hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {work.title}
                    {work.featured && <Badge variant="default">Featured</Badge>}
                    <Badge variant="secondary">{work.category}</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {work.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {work.project_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={work.project_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {work.github_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={work.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(work)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(work.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Images Grid */}
              {work.images && work.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {work.images.slice(0, 4).map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`${work.title} - Image ${index + 1}`}
                      className="w-full h-16 object-cover rounded border"
                    />
                  ))}
                  {work.images.length > 4 && (
                    <div className="w-full h-16 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                      +{work.images.length - 4} more
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-wrap gap-1">
                {work.technologies?.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminWorksForm;