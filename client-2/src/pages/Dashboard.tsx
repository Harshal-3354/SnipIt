import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Copy,
  Edit,
  ExternalLink,
  Link as LinkIcon,
  Plus,
  Search,
  Trash2,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import CreateLinkModal from "@/components/CreateLinkModal";

interface ShortLink {
  _id: string;
  originalUrl: string;
  shortId: string;
  clickCount: number;
  createdAt: string;
  status: "active" | "expired";
}

const Dashboard = () => {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ✅ Fetch user links
  const fetchLinks = async () => {
    try {
      const res = await axiosInstance.get("/links/my");
      setLinks(res.data);
    } catch (err) {
      toast("Error", {
        description: "Failed to fetch your links. Please try again.",
        action: {
          label: "Retry",
          onClick: () => fetchLinks(),
        },
      });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // ✅ Copy to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast("Copied to clipboard!", {
      description: "Short URL has been copied.",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  };

  // ✅ Delete link
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/links/${id}/delete`);
      setLinks((prev) => prev.filter((link) => link._id !== id));
      toast("Deleted", {
        description: "The link has been deleted.",
        action: {
          label: "Undo",
          onClick: () => fetchLinks(),
        },
      });
    } catch {
      toast("Error", {
        description: "Failed to delete link.",
        action: {
          label: "Retry",
          onClick: () => fetchLinks(),
        },
      });
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredLinks = links.filter(
    (link) =>
      link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.shortId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen 
      bg-gradient-to-br from-gray-50 to-white 
      dark:from-gray-950 dark:to-gray-900 
      transition-colors duration-500"
    >
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md bg-white/70 dark:bg-gray-900/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              ShortLink
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setDarkMode(!darkMode);
              }}
              className="rounded-full"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your links and view analytics
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Link
          </Button>
        </div>

        {/* Create Link Modal */}
        <CreateLinkModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={fetchLinks}
        />

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card border-border/50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Links</p>
                  <p className="text-3xl font-bold">{links.length}</p>
                </div>
                <LinkIcon className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-3xl font-bold">
                    {links
                      .reduce((sum, l) => sum + l.clickCount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Links</p>
                  <p className="text-3xl font-bold">
                    {links.filter((l) => l.status === "active").length}
                  </p>
                </div>
                <ExternalLink className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6 shadow-card border-border/50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Links Table */}
        <Card className="shadow-card border-border/50 bg-white/90 dark:bg-gray-900/70 backdrop-blur-md">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50">
                  <tr>
                    <th className="text-left p-6 font-medium text-muted-foreground">
                      Original URL
                    </th>
                    <th className="text-left p-6 font-medium text-muted-foreground">
                      Short URL
                    </th>
                    <th className="text-left p-6 font-medium text-muted-foreground">
                      Clicks
                    </th>
                    <th className="text-left p-6 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-6 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map((link) => (
                    <tr
                      key={link._id}
                      className="border-b border-border/50 hover:bg-muted/30"
                    >
                      <td className="p-6">
                        <div className="max-w-xs truncate">
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {link.originalUrl}
                          </a>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            https://snipit-8euj.onrender.com/r/{link.shortId}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                `https://snipit-8euj.onrender.com/r/${link.shortId}`
                              )
                            }
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-semibold">
                          {link.clickCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-6">
                        <Badge
                          variant={
                            link.status === "active" ? "default" : "secondary"
                          }
                        >
                          {link.status}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <Link to={`/analytics/${link._id}`}>
                            <Button variant="ghost" size="sm">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(link._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
