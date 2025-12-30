import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import AIAssistant from "@/components/ai/AIAssistant";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Zap,
  BarChart3,
  Wind,
  User,
  Menu,
  X,
  LogOut,
  Bot,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Tasks", icon: CheckSquare, path: "/tasks" },
    { label: "Focus Timer", icon: Timer, path: "/timer" },
    { label: "AI Assistant", icon: Bot, onClick: () => setIsAIAssistantOpen(true) },
    { label: "Gamification", icon: Zap, path: "/gamification" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Mindfulness", icon: Wind, path: "/mindfulness" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Clario
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              if (item.onClick) {
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:block">{user?.name}</span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-slate-300" />
              ) : (
                <Menu className="w-5 h-5 text-slate-300" />
              )}
            </button>

            {/* Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-300" />
            </button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

          {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t border-slate-800 bg-slate-800/50 backdrop-blur p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              if (item.onClick) {
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.onClick?.();
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-slate-400 hover:text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <div className="flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className="hidden lg:block w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">QUICK STATS</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Focus Time</span>
                    <span className="text-cyan-400 font-semibold">4.5h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tasks Done</span>
                    <span className="text-purple-400 font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Streak</span>
                    <span className="text-orange-400 font-semibold">5 days</span>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm font-semibold text-blue-300 mb-2">💡 Pro Tip</p>
                <p className="text-xs text-blue-200/80">
                  Start your day with clear goals. Break tasks into smaller chunks for better focus!
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
          <AIAssistant open={isAIAssistantOpen} onOpenChange={setIsAIAssistantOpen} />
        </main>
      </div>
    </div>
  );
}
