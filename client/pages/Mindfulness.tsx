import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAppData } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Wind, Heart, Zap } from "lucide-react";

type BreathingPhase = "inhale" | "hold" | "exhale" | "idle";

export default function Mindfulness() {
  const { mindfulnessSessions, addMindfulnessSession, addPoints } = useAppData();

  // Breathing exercise state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>("idle");
  const [phaseTime, setPhaseTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [customDuration, setCustomDuration] = useState(5);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showCustom, setShowCustom] = useState(false);

  const phaseSettings = {
    inhale: { duration: 4, color: "from-blue-400 to-cyan-500", label: "Inhale" },
    hold: { duration: 4, color: "from-purple-400 to-purple-500", label: "Hold" },
    exhale: { duration: 4, color: "from-green-400 to-emerald-500", label: "Exhale" },
  };

  const phases: BreathingPhase[] = ["inhale", "hold", "exhale"];

  // Breathing exercise timer
  useEffect(() => {
    if (!isSessionActive) return;

    const timer = setInterval(() => {
      setPhaseTime((prev) => {
        const currentPhaseSettings = phaseSettings[phase];
        if (prev >= (currentPhaseSettings.duration * 1000) / 1000 - 1) {
          // Move to next phase
          const currentIndex = phases.indexOf(phase);
          const nextIndex = (currentIndex + 1) % phases.length;
          const nextPhase = phases[nextIndex];
          setPhase(nextPhase);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive, phase]);

  const startSession = () => {
    setIsSessionActive(true);
    setPhase("inhale");
    setPhaseTime(0);
  };

  const endSession = () => {
    setIsSessionActive(false);
    setPhase("idle");
    setPhaseTime(0);
    
    // Log the session
    addMindfulnessSession({
      duration: duration * 60,
      completedAt: new Date().toISOString(),
      type: "breathing",
    });
    
    addPoints(5);
    setSessionsCompleted((prev) => prev + 1);
  };

  const resetSession = () => {
    setIsSessionActive(false);
    setPhase("idle");
    setPhaseTime(0);
  };

  const getBreathingScale = () => {
    if (phase === "idle") return 1;
    const progress = phaseTime / phaseSettings[phase].duration;
    if (phase === "inhale") return 1 + progress * 0.5;
    if (phase === "exhale") return 1.5 - progress * 0.5;
    return 1.5;
  };

  const scale = getBreathingScale();

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Mindfulness</h1>
          <p className="text-slate-400">Take a mindful break and reset your focus</p>
        </div>

        {/* Breathing Exercise */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="text-center">
            {/* Duration Selector */}
            {!isSessionActive && (
              <div className="mb-8">
                <p className="text-slate-400 text-sm mb-4">Session Duration</p>
                <div className="flex gap-2 justify-center mb-4">
                  {[3, 5, 10, 15].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDuration(d);
                        setShowCustom(false);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        duration === d
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowCustom(!showCustom)}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  {showCustom ? "Hide" : "Custom duration"}
                </button>

                {showCustom && (
                  <div className="mt-4 flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(parseInt(e.target.value) || 5)}
                      className="bg-slate-700 border-slate-600 text-white text-center"
                    />
                    <Button
                      onClick={() => {
                        setDuration(customDuration);
                        setShowCustom(false);
                      }}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      Set
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Breathing Circle */}
            <div className="mb-8">
              <div className="flex justify-center items-center h-64">
                <div className="relative w-48 h-48">
                  {/* Background circle */}
                  <svg className="absolute inset-0 w-full h-full">
                    <circle
                      cx="96"
                      cy="96"
                      r="90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-slate-700"
                    />
                  </svg>

                  {/* Breathing circle */}
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${
                      phase === "idle"
                        ? "from-slate-600 to-slate-700"
                        : phaseSettings[phase].color
                    } opacity-20 transition-all duration-300 ease-in-out`}
                    style={{
                      transform: `scale(${scale})`,
                    }}
                  />

                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-sm text-slate-400 mb-2">
                      {phase === "idle" ? "Ready?" : phaseSettings[phase].label}
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {phaseSettings[phase as Exclude<BreathingPhase, "idle">]?.duration || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phase indicator */}
              {isSessionActive && (
                <div className="flex justify-center gap-2 mb-4">
                  {phases.map((p) => (
                    <div
                      key={p}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        p === phase ? `bg-gradient-to-r ${phaseSettings[p].color}` : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center mb-6">
              {!isSessionActive ? (
                <Button
                  onClick={startSession}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white font-semibold rounded-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Session
                </Button>
              ) : (
                <>
                  <Button
                    onClick={endSession}
                    className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold rounded-lg"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    End Session
                  </Button>
                  <Button
                    onClick={resetSession}
                    className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </>
              )}
            </div>

            {/* Timer Progress */}
            {isSessionActive && (
              <p className="text-slate-400 text-sm">
                Session in progress...
              </p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">How to Breathe</h3>
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <div>
                <p className="text-white font-semibold">Inhale for 4 seconds</p>
                <p className="text-sm text-slate-400">
                  Slowly breathe in through your nose, counting to 4
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <div>
                <p className="text-white font-semibold">Hold for 4 seconds</p>
                <p className="text-sm text-slate-400">
                  Pause and hold your breath, feeling calm
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <div>
                <p className="text-white font-semibold">Exhale for 4 seconds</p>
                <p className="text-sm text-slate-400">
                  Slowly breathe out through your mouth, counting to 4
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-2">SESSIONS TODAY</p>
            <p className="text-3xl font-bold text-cyan-400">{sessionsCompleted}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-2">TOTAL SESSIONS</p>
            <p className="text-3xl font-bold text-purple-400">{mindfulnessSessions.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-2">SESSION DURATION</p>
            <p className="text-3xl font-bold text-emerald-400">{duration}m</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-400" />
            Benefits of Mindfulness
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✓ Reduces stress and anxiety</li>
            <li>✓ Improves focus and concentration</li>
            <li>✓ Enhances emotional regulation</li>
            <li>✓ Better sleep quality</li>
            <li>✓ Increases self-awareness</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
