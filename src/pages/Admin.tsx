import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Mail, MailCheck, MessageSquare, LogOut } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AdminBlogForm from "@/components/admin/AdminBlogForm";
import AdminWorksForm from "@/components/admin/AdminWorksForm";
import AdminSkillsForm from "@/components/admin/AdminSkillsForm";
import AdminEducationForm from "@/components/admin/AdminEducationForm";
import AdminExperienceForm from "@/components/admin/AdminExperienceForm";
import AdminStatisticsForm from "@/components/admin/AdminStatisticsForm";
import AdminContactMessages from "@/components/admin/AdminContactMessages";
import AdminBrandsForm from "@/components/admin/AdminBrandsForm";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    blogs: 0,
    works: 0,
    skills: 0,
    messages: 0,
    unread: 0,
    brands: 0
  });
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogsRes, worksRes, skillsRes, messagesRes, brandsRes] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact" }),
        supabase.from("works").select("id", { count: "exact" }),
        supabase.from("skills").select("id", { count: "exact" }),
        supabase.from("contact_submissions").select("id, read", { count: "exact" }),
        supabase.from("brands").select("id", { count: "exact" })
      ]);

      const unreadCount = messagesRes.data?.filter(msg => !msg.read).length || 0;

      setStats({
        blogs: blogsRes.count || 0,
        works: worksRes.count || 0,
        skills: skillsRes.count || 0,
        messages: messagesRes.count || 0,
        unread: unreadCount,
        brands: brandsRes.count || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin dashboard.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const statsCards = [
    { title: "Blog Posts", value: stats.blogs, icon: "📝", color: "bg-blue-500/10 text-blue-500" },
    { title: "Works", value: stats.works, icon: "💼", color: "bg-green-500/10 text-green-500" },
    { title: "Skills", value: stats.skills, icon: "⚡", color: "bg-purple-500/10 text-purple-500" },
    { title: "Brands", value: stats.brands, icon: "🏢", color: "bg-indigo-500/10 text-indigo-500" },
    { title: "Messages", value: stats.messages, icon: "📧", color: "bg-orange-500/10 text-orange-500" },
    { title: "Unread", value: stats.unread, icon: "🔔", color: "bg-red-500/10 text-red-500" }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your portfolio content and messages
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
            {statsCards.map((stat, index) => (
              <Card key={index} className="hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="blogs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 overflow-x-auto">
              <TabsTrigger value="blogs" className="text-xs sm:text-sm">Blogs</TabsTrigger>
              <TabsTrigger value="works" className="text-xs sm:text-sm">Works</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs sm:text-sm">Skills</TabsTrigger>
              <TabsTrigger value="education" className="text-xs sm:text-sm">Education</TabsTrigger>
              <TabsTrigger value="experience" className="text-xs sm:text-sm">Experience</TabsTrigger>
              <TabsTrigger value="statistics" className="text-xs sm:text-sm">Statistics</TabsTrigger>
              <TabsTrigger value="brands" className="text-xs sm:text-sm">Brands</TabsTrigger>
              <TabsTrigger value="messages" className="relative text-xs sm:text-sm">
                Messages
                {stats.unread > 0 && (
                  <Badge variant="destructive" className="ml-1 sm:ml-2 px-1 py-0 text-xs min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px]">
                    {stats.unread}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blogs">
              <AdminBlogForm searchTerm={searchTerm} onStatsUpdate={fetchStats} />
            </TabsContent>

            <TabsContent value="works">
              <AdminWorksForm searchTerm={searchTerm} onStatsUpdate={fetchStats} />
            </TabsContent>

            <TabsContent value="skills">
              <AdminSkillsForm searchTerm={searchTerm} onStatsUpdate={fetchStats} />
            </TabsContent>

            <TabsContent value="education">
              <AdminEducationForm searchTerm={searchTerm} onStatsUpdate={fetchStats} />
            </TabsContent>

            <TabsContent value="experience">
              <AdminExperienceForm searchTerm={searchTerm} onStatsUpdate={fetchStats} />
            </TabsContent>

            <TabsContent value="statistics">
              <AdminStatisticsForm searchTerm={searchTerm} onStatsUpdate={fetchStats} />
            </TabsContent>

            <TabsContent value="brands">
              <AdminBrandsForm searchTerm={searchTerm} onStatsUpdate={fetchStats} />
            </TabsContent>

            <TabsContent value="messages">
              <AdminContactMessages searchTerm={searchTerm} onStatsUpdate={fetchStats} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;