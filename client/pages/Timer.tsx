import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAppData } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getQuoteByContext } from "@/utils/quotes";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  History,
  Wind,
  Trophy,
} from "lucide-react";

type TimerMode = "focus" | "break" | "idle";

export default function Timer() {
  const { focusSessions, completeFocusSession, addFocusSession, gamification, addPoints } = useAppData();
  
  // Timer state
  const [mode, setMode] = useState<TimerMode>("idle");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (mode === "idle") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimerComplete();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);

  const handleTimerComplete = () => {
    const motivationalMessage = mode === "focus"
      ? getQuoteByContext("achievement")
      : getQuoteByContext("break");

    // Notify user
    if ("Notification" in window && Notification.permission === "granted") {
      const message = mode === "focus"
        ? "Focus session complete! Time for a break."
        : "Break time's over! Ready for another focus session?";
      new Notification("Clario Timer", {
        body: `${message}\n\n${motivationalMessage}`,
      });
    }

    if (mode === "focus") {
      if (currentSessionId) {
        completeFocusSession(currentSessionId);
      }
      setSessionsCompleted((prev) => prev + 1);
      addPoints(focusDuration * 10);
      
      // Check for badges
      if (sessionsCompleted + 1 === 5) {
        // Add badge logic
      }

      // Switch to break
      setMode("break");
      setTimeLeft(breakDuration * 60);
    } else {
      // Switch back to idle after break
      setMode("idle");
      setTimeLeft(focusDuration * 60);
    }
  };

  const handleStart = () => {
    if (mode === "idle") {
      const session = addFocusSession({
        startTime: new Date().toISOString(),
        focusDuration: focusDuration * 60,
        breakDuration: breakDuration * 60,
        isCompleted: false,
        linkedTaskIds: [],
        type: "focus",
      });
      setCurrentSessionId(session.id);
      setMode("focus");
      setTimeLeft(focusDuration * 60);
    } else {
      setMode(mode === "focus" ? "focus" : "break");
    }
  };

  const handlePause = () => {
    setMode("idle");
  };

  const handleReset = () => {
    setMode("idle");
    setTimeLeft(focusDuration * 60);
    setSessionsCompleted(0);
    setCurrentSessionId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = mode === "focus"
    ? ((focusDuration * 60 - timeLeft) / (focusDuration * 60)) * 100
    : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Focus Timer</h1>
          <p className="text-slate-400">Time to focus and build your productivity streak</p>
        </div>

        {/* Timer Display */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="text-center">
            {/* Mode Indicator */}
            <div className="mb-6">
              <span
                className={`text-sm font-bold px-4 py-2 rounded-full ${
                  mode === "focus"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : mode === "break"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-700 text-slate-400"
                }`}
              >
                {mode === "focus"
                  ? "🎯 Focus Mode"
                  : mode === "break"
                    ? "☕ Break Time"
                    : "⏸️ Ready to Start"}
              </span>
            </div>

            {/* Large Timer Display */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(progress / 100) * 565.48} 565.48`}
                  className={`transition-all duration-500 ${
                    mode === "focus"
                      ? "text-cyan-400"
                      : mode === "break"
                        ? "text-emerald-400"
                        : "text-slate-600"
                  }`}
                />
              </svg>

              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold text-white">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-slate-400 mt-2">
                  {mode === "focus"
                    ? "Focus"
                    : mode === "break"
                      ? "Break"
                      : "Paused"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center mb-6">
              <Button
                onClick={handleStart}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  mode === "idle"
                    ? "bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                }`}
              >
                <Play className="w-5 h-5 mr-2" />
                Start
              </Button>

              <Button
                onClick={handlePause}
                disabled={mode === "idle"}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-semibold disabled:opacity-50"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>

              <Button
                onClick={handleReset}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-semibold"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>

              <Button
                onClick={() => setShowSettings(!showSettings)}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-semibold"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>

            {/* Sessions Counter */}
            <div className="text-slate-400">
              <p className="text-sm">
                Sessions completed today: <span className="text-cyan-400 font-semibold">{sessionsCompleted}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Timer Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Focus Duration (minutes)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  value={focusDuration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 25;
                    setFocusDuration(val);
                    if (mode === "idle") setTimeLeft(val * 60);
                  }}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Break Duration (minutes)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-2">TOTAL SESSIONS</p>
            <p className="text-3xl font-bold text-cyan-400">{focusSessions.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-2">STREAK</p>
            <p className="text-3xl font-bold text-orange-400">{gamification.currentStreak} days</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-2">POINTS EARNED</p>
            <p className="text-3xl font-bold text-yellow-400">{gamification.points}</p>
          </div>
        </div>

        {/* Session History */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Recent Sessions
          </h3>
          <div className="space-y-3">
            {focusSessions.slice(-5).reverse().map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {session.type === "focus" ? "Focus Session" : "Break"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(session.startTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-cyan-400">
                  {Math.floor((session.focusDuration || 0) / 60)}m
                </span>
              </div>
            ))}
            {focusSessions.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">
                No sessions yet. Start your first focus session!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
