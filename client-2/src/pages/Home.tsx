import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Link as LinkIcon,
  BarChart3,
  Shield,
  Zap,
  Sun,
  Moon,
} from "lucide-react";

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } backdrop-blur-sm`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              ShortLink
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:shadow-md">
                Get Started
              </Button>
            </Link>
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Smarter Links, Better Insights
          </h1>
          <p className="text-lg mb-12 max-w-2xl mx-auto opacity-80">
            ShortLink is a modern URL shortener that helps you transform long
            URLs into short, trackable links. With built-in analytics,
            enterprise-level security, and lightning-fast performance — it’s
            more than just a short link, it’s a smart link.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card
              className={`p-6 text-center rounded-xl shadow-sm hover:shadow-md transition 
      ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      }`}
            >
              <BarChart3 className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm`}
              >
                Track clicks, devices, browsers, and locations with detailed
                insights to understand your audience better.
              </p>
            </Card>

            <Card
              className={`p-6 text-center rounded-xl shadow-sm hover:shadow-md transition 
      ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      }`}
            >
              <Shield className="w-10 h-10 text-purple-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Security</h3>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm`}
              >
                Protect your links with password locks, set expiration dates,
                and ensure enterprise-grade encryption.
              </p>
            </Card>

            <Card
              className={`p-6 text-center rounded-xl shadow-sm hover:shadow-md transition 
      ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      }`}
            >
              <Zap className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Performance</h3>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm`}
              >
                Experience lightning-fast redirects across the globe with our
                optimized CDN and scalable infrastructure.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
function setMode(arg0: () => void) {
  throw new Error("Function not implemented.");
}
