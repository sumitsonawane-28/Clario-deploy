import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getRandomQuote } from "@/utils/quotes";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Zap,
  BarChart3,
  Wind,
  ArrowRight,
  TrendingUp,
  Flame,
  Star,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, focusSessions, gamification, mindfulnessSessions } = useAppData();
  const [dailyQuote, setDailyQuote] = useState("");

  // Load quote on mount
  useEffect(() => {
    setDailyQuote(getRandomQuote());
  }, []);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const activeTasks = tasks.filter((t) => t.status !== "completed").length;
  const totalFocusTime = focusSessions.reduce((acc, s) => acc + (s.focusDuration || 0), 0);

  const quickActions = [
    { label: "Start Focus", icon: Timer, path: "/timer", color: "from-cyan-400 to-cyan-600" },
    { label: "Add Task", icon: CheckSquare, path: "/tasks", color: "from-purple-400 to-purple-600" },
    { label: "Breathing", icon: Wind, path: "/mindfulness", color: "from-emerald-400 to-emerald-600" },
    { label: "View Stats", icon: BarChart3, path: "/analytics", color: "from-orange-400 to-orange-600" },
  ];

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-400 mb-4">{dailyQuote}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <button className={`w-full group relative overflow-hidden rounded-xl p-6 text-white font-semibold transition-all hover:scale-105 active:scale-95 bg-gradient-to-br ${action.color}`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6" />
                      <span>{action.label}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </Link>
            );
          })}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Focus Time Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">FOCUS TIME TODAY</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {Math.floor(totalFocusTime / 60)}m
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Timer className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div className="flex items-center text-xs text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              Up 20% from yesterday
            </div>
          </div>

          {/* Tasks Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">TASKS COMPLETED</p>
                <p className="text-3xl font-bold text-purple-400">{completedTasks}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-slate-400">{activeTasks} pending tasks</p>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">CURRENT STREAK</p>
                <p className="text-3xl font-bold text-orange-400">{gamification.currentStreak}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <p className="text-xs text-slate-400">Days in a row</p>
          </div>

          {/* Level Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">LEVEL</p>
                <p className="text-3xl font-bold text-yellow-400">{gamification.level}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-xs text-slate-400">{gamification.points} points</p>
          </div>
        </div>

        {/* Sections Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tasks */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-purple-400" />
                Recent Tasks
              </h2>
              <Link to="/tasks" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      task.priority === "high"
                        ? "bg-red-400"
                        : task.priority === "medium"
                          ? "bg-yellow-400"
                          : "bg-green-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.category || "No category"}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${
                      task.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No tasks yet. Create one to get started!</p>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Achievements
              </h2>
              <Link to="/gamification" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {gamification.badges.length > 0 ? (
                gamification.badges.slice(0, 3).map((badge) => (
                  <div key={badge} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-2xl">🏆</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200">{badge}</p>
                      <p className="text-xs text-slate-500">Achievement unlocked</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Complete tasks to unlock badges!</p>
              )}
            </div>
          </div>
        </div>

        {/* Mindfulness Quick Start */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl p-8 text-center">
          <Wind className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Take a Mindfulness Break</h3>
          <p className="text-slate-300 mb-4 max-w-md mx-auto">
            A few minutes of deep breathing can reset your focus and reduce stress
          </p>
          <Link to="/mindfulness">
            <Button className="bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-slate-900 font-semibold">
              Start Breathing Session
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
