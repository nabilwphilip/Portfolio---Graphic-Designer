import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Statistic {
  id: string;
  key: string;
  label: string;
  value: number;
  icon: string;
  updated_at: string;
}

interface AdminStatisticsFormProps {
  searchTerm: string;
  onStatsUpdate: () => void;
}

const AdminStatisticsForm = ({ searchTerm, onStatsUpdate }: AdminStatisticsFormProps) => {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStatistic, setEditingStatistic] = useState<Statistic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    key: "",
    label: "",
    value: 0,
    icon: ""
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .order("key", { ascending: true });
      
      if (error) throw error;
      setStatistics(data || []);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast({ title: "Error", description: "Failed to fetch statistics", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (editingStatistic) {
        result = await supabase
          .from("statistics")
          .update(formData)
          .eq("id", editingStatistic.id);
      } else {
        result = await supabase
          .from("statistics")
          .insert([formData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Statistic ${editingStatistic ? "updated" : "created"} successfully`,
      });

      resetForm();
      fetchStatistics();
      onStatsUpdate();
    } catch (error) {
      console.error("Error saving statistic:", error);
      toast({ title: "Error", description: "Failed to save statistic", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (stat: Statistic) => {
    setEditingStatistic(stat);
    setFormData({
      key: stat.key,
      label: stat.label,
      value: stat.value,
      icon: stat.icon || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this statistic?")) return;

    try {
      const { error } = await supabase
        .from("statistics")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Statistic deleted successfully" });
      fetchStatistics();
      onStatsUpdate();
    } catch (error) {
      console.error("Error deleting statistic:", error);
      toast({ title: "Error", description: "Failed to delete statistic", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      key: "",
      label: "",
      value: 0,
      icon: ""
    });
    setEditingStatistic(null);
    setIsDialogOpen(false);
  };

  const filteredStatistics = statistics.filter(stat =>
    stat.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stat.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Statistics</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStatistic(null)} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Statistic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingStatistic ? "Edit Statistic" : "Create New Statistic"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key">Key (unique identifier)</Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="projects_completed"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Projects Completed"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon (emoji or icon name)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🚀 or lucide-icon-name"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-primary">
                  {isLoading ? "Saving..." : editingStatistic ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStatistics.map((stat) => (
          <Card key={stat.id} className="hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {stat.icon && <span className="text-lg">{stat.icon}</span>}
                    <BarChart3 className="h-5 w-5 text-primary" />
                    {stat.label}
                  </CardTitle>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Key: {stat.key}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(stat)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(stat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminStatisticsForm;