import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Briefcase, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
}

interface AdminExperienceFormProps {
  searchTerm: string;
  onStatsUpdate: () => void;
}

const AdminExperienceForm = ({ searchTerm, onStatsUpdate }: AdminExperienceFormProps) => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    description: ""
  });

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false });
      
      if (error) throw error;
      setExperience(data || []);
    } catch (error) {
      console.error("Error fetching experience:", error);
      toast({ title: "Error", description: "Failed to fetch experience", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (editingExperience) {
        result = await supabase
          .from("experience")
          .update(formData)
          .eq("id", editingExperience.id);
      } else {
        result = await supabase
          .from("experience")
          .insert([formData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Experience ${editingExperience ? "updated" : "created"} successfully`,
      });

      resetForm();
      fetchExperience();
      onStatsUpdate();
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({ title: "Error", description: "Failed to save experience", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      location: exp.location || "",
      start_date: exp.start_date,
      end_date: exp.end_date || "",
      description: exp.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    try {
      const { error } = await supabase
        .from("experience")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Experience deleted successfully" });
      fetchExperience();
      onStatsUpdate();
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({ title: "Error", description: "Failed to delete experience", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      description: ""
    });
    setEditingExperience(null);
    setIsDialogOpen(false);
  };

  const filteredExperience = experience.filter(exp =>
    exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Experience</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingExperience(null)} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-primary">
                  {isLoading ? "Saving..." : editingExperience ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredExperience.map((exp) => (
          <Card key={exp.id} className="hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    {exp.title}
                  </CardTitle>
                  <p className="text-lg font-medium text-muted-foreground mt-1">
                    {exp.company}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(exp.start_date).toLocaleDateString()} - 
                      {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : "Present"}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(exp)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(exp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {exp.description && (
              <CardContent>
                <p className="text-muted-foreground">{exp.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminExperienceForm;