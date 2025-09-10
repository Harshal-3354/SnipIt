import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link as LinkIcon, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      toast("Welcome back! 🎉", {
        description: "You have been successfully logged in.",
        action: {
          label: "Go to Dashboard",
          onClick: () => navigate("/dashboard"),
        },
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast("Login failed", {
        description:
          error.response?.data?.message || "Invalid email or password.",
        action: {
          label: "Retry",
          onClick: () => setIsLoading(false),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 
      bg-gradient-to-br from-indigo-50 via-white to-purple-100 
      dark:from-gray-950 dark:via-gray-900 dark:to-black 
      transition-colors duration-500"
    >
      <Card
        className="w-full max-w-md backdrop-blur-lg bg-white/80 dark:bg-gray-900/70 
        border border-white/20 dark:border-gray-800/50 
        shadow-2xl rounded-2xl transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
      >
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 
              rounded-xl flex items-center justify-center shadow-md"
            >
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <span
              className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 
              bg-clip-text text-transparent tracking-tight"
            >
              ShortLink
            </span>
          </div>
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your account to access your dashboard
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-5">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 
              hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] 
              transition-all duration-300 text-white font-medium py-2.5 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
