import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GraduationCap, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Education {
  id: string;
  degree: string;
  institution: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
}

interface AdminEducationFormProps {
  searchTerm: string;
  onStatsUpdate: () => void;
}

const AdminEducationForm = ({ searchTerm, onStatsUpdate }: AdminEducationFormProps) => {
  const [education, setEducation] = useState<Education[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    start_date: "",
    end_date: "",
    description: ""
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("start_date", { ascending: false });
      
      if (error) throw error;
      setEducation(data || []);
    } catch (error) {
      console.error("Error fetching education:", error);
      toast({ title: "Error", description: "Failed to fetch education", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (editingEducation) {
        result = await supabase
          .from("education")
          .update(formData)
          .eq("id", editingEducation.id);
      } else {
        result = await supabase
          .from("education")
          .insert([formData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Education ${editingEducation ? "updated" : "created"} successfully`,
      });

      resetForm();
      fetchEducation();
      onStatsUpdate();
    } catch (error) {
      console.error("Error saving education:", error);
      toast({ title: "Error", description: "Failed to save education", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      start_date: edu.start_date,
      end_date: edu.end_date || "",
      description: edu.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;

    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Education deleted successfully" });
      fetchEducation();
      onStatsUpdate();
    } catch (error) {
      console.error("Error deleting education:", error);
      toast({ title: "Error", description: "Failed to delete education", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      degree: "",
      institution: "",
      start_date: "",
      end_date: "",
      description: ""
    });
    setEditingEducation(null);
    setIsDialogOpen(false);
  };

  const filteredEducation = education.filter(edu =>
    edu.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edu.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Education</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEducation(null)} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Education
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEducation ? "Edit Education" : "Add New Education"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    required
                  />
                </div>
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
                  {isLoading ? "Saving..." : editingEducation ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredEducation.map((edu) => (
          <Card key={edu.id} className="hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {edu.degree}
                  </CardTitle>
                  <p className="text-lg font-medium text-muted-foreground mt-1">
                    {edu.institution}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(edu.start_date).toLocaleDateString()} - 
                      {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : "Present"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(edu)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(edu.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {edu.description && (
              <CardContent>
                <p className="text-muted-foreground">{edu.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminEducationForm;