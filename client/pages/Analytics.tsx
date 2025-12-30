import { useState } from "react";
import Layout from "@/components/Layout";
import { useAppData } from "@/contexts/AppDataContext";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, TrendingUp, Target } from "lucide-react";

export default function Analytics() {
  const { focusSessions, tasks, gamification } = useAppData();
  const [dateRange, setDateRange] = useState("week");

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const totalFocusTime = focusSessions.reduce((acc, s) => acc + (s.focusDuration || 0), 0);

  // Generate mock daily data for the past 7 days
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000);
    return {
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      sessions: Math.floor(Math.random() * 4) + 1,
      duration: Math.floor(Math.random() * 120) + 30,
      tasks: Math.floor(Math.random() * 3) + 1,
    };
  });

  const tasksByCategory = Array.from(
    tasks.reduce((acc, task) => {
      const category = task.category || "Uncategorized";
      const count = (acc.get(category) || 0) + 1;
      acc.set(category, count);
      return acc;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value }));

  const tasksByPriority = [
    { name: "High", value: tasks.filter((t) => t.priority === "high").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "medium").length },
    { name: "Low", value: tasks.filter((t) => t.priority === "low").length },
  ];

  const COLORS = ["#06b6d4", "#8b5cf6", "#10b981"];

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-slate-400">Track your productivity and progress</p>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-2 mb-8">
          {["week", "month", "all"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                dateRange === range
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-2">FOCUS TIME</p>
            <p className="text-3xl font-bold text-cyan-400">
              {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
            </p>
            <p className="text-xs text-slate-500 mt-2">Total focus sessions</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-2">TASK COMPLETION</p>
            <p className="text-3xl font-bold text-purple-400">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {completedTasks} of {totalTasks} tasks
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-2">CURRENT STREAK</p>
            <p className="text-3xl font-bold text-orange-400">{gamification.currentStreak} days</p>
            <p className="text-xs text-slate-500 mt-2">Keep it going!</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Activity Chart */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Daily Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="sessions" stackId="a" fill="#06b6d4" name="Sessions" />
                <Bar dataKey="tasks" stackId="a" fill="#8b5cf6" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Focus Time Trend */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Focus Time Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#06b6d4"
                  dot={{ fill: "#06b6d4" }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tasks by Priority */}
          {tasksByPriority.some((p) => p.value > 0) && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Tasks by Priority</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tasksByPriority}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color) => (
                      <Cell key={`cell-${color}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Tasks by Category */}
          {tasksByCategory.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Tasks by Category
              </h3>
              <div className="space-y-3">
                {tasksByCategory.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"
                          style={{
                            width: `${
                              (cat.value /
                                Math.max(...tasksByCategory.map((c) => c.value))) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-cyan-400 w-8">
                        {cat.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">💡 Insights</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              • You're most productive on{" "}
              <span className="text-cyan-400 font-semibold">
                {dailyData.reduce((max, d) => (d.sessions > max.sessions ? d : max)).date}
              </span>
            </li>
            <li>
              • Average focus session:{" "}
              <span className="text-cyan-400 font-semibold">
                {Math.round(
                  dailyData.reduce((acc, d) => acc + d.duration, 0) / dailyData.length
                )}
                m
              </span>
            </li>
            <li>
              • Task completion rate:{" "}
              <span className="text-cyan-400 font-semibold">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </span>
            </li>
            <li>
              • Current streak: Keep up your momentum! You're doing great at{" "}
              <span className="text-cyan-400 font-semibold">
                {gamification.currentStreak} days
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
