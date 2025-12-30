import Layout from "@/components/Layout";
import { useAppData } from "@/contexts/AppDataContext";
import { Trophy, Star, Target, Zap, Flame, Award } from "lucide-react";

export default function Gamification() {
  const { gamification, focusSessions, tasks } = useAppData();

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalSessions = focusSessions.length;

  const allBadges = [
    { id: "first-task", name: "First Step", description: "Complete your first task", icon: "🎯", earned: completedTasks >= 1 },
    { id: "5-tasks", name: "Go Getter", description: "Complete 5 tasks", icon: "💪", earned: completedTasks >= 5 },
    { id: "10-tasks", name: "Productivity Pro", description: "Complete 10 tasks", icon: "🚀", earned: completedTasks >= 10 },
    { id: "first-session", name: "Focused", description: "Complete your first focus session", icon: "⏱️", earned: totalSessions >= 1 },
    { id: "5-sessions", name: "Time Master", description: "Complete 5 focus sessions", icon: "⌚", earned: totalSessions >= 5 },
    { id: "10-sessions", name: "Unstoppable", description: "Complete 10 focus sessions", icon: "🌟", earned: totalSessions >= 10 },
    { id: "3-streak", name: "On Fire", description: "3-day streak", icon: "🔥", earned: gamification.currentStreak >= 3 },
    { id: "7-streak", name: "Week Warrior", description: "7-day streak", icon: "🏆", earned: gamification.currentStreak >= 7 },
  ];

  const challenges = [
    { id: "daily-focus", name: "Daily Focus", description: "Complete 2 focus sessions today", progress: 0, target: 2, icon: "⏱️" },
    { id: "task-master", name: "Task Master", description: "Complete 5 tasks this week", progress: 0, target: 5, icon: "✅" },
    { id: "consistent", name: "Consistent", description: "Maintain a 7-day streak", progress: gamification.currentStreak, target: 7, icon: "🎯" },
  ];

  const earnedBadges = allBadges.filter((b) => b.earned);

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Gamification</h1>
          <p className="text-slate-400">Track achievements and unlock badges</p>
        </div>

        {/* Level and Points Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-purple-300 mb-1">CURRENT LEVEL</p>
                <p className="text-4xl font-bold text-purple-400">{gamification.level}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="bg-slate-700 rounded-full h-2 mb-2">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all"
                style={{ width: `${((gamification.points % 500) / 500) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {gamification.points % 500} / 500 points to next level
            </p>
          </div>

          {/* Points Card */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-yellow-300 mb-1">TOTAL POINTS</p>
                <p className="text-4xl font-bold text-yellow-400">{gamification.points}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-xs text-slate-400">Keep pushing to earn more points!</p>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-900/20 border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-orange-300 mb-1">CURRENT STREAK</p>
                <p className="text-4xl font-bold text-orange-400">{gamification.currentStreak}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Best streak: {gamification.totalStreak} days
            </p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Achievements
            </h2>
            <span className="text-sm text-slate-400">
              {earnedBadges.length} / {allBadges.length} earned
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all ${
                  badge.earned
                    ? "bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:border-yellow-500/50"
                    : "bg-slate-900/50 border-slate-700 opacity-50"
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1">{badge.name}</h3>
                <p className="text-xs text-slate-400">{badge.description}</p>
                {badge.earned && (
                  <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Unlocked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Challenges Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-400" />
            Active Challenges
          </h2>

          <div className="space-y-4">
            {challenges.map((challenge) => {
              const progress = (challenge.progress / challenge.target) * 100;
              return (
                <div
                  key={challenge.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{challenge.icon}</span>
                        <h3 className="text-lg font-bold text-white">{challenge.name}</h3>
                      </div>
                      <p className="text-sm text-slate-400">{challenge.description}</p>
                    </div>
                    <span className="text-sm font-semibold text-cyan-400">
                      {challenge.progress} / {challenge.target}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  {progress === 100 && (
                    <div className="mt-3 text-sm text-green-400 flex items-center gap-2">
                      ✓ Challenge completed!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
