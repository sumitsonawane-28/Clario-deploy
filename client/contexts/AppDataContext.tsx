import React, { createContext, useContext, useState, useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate?: string;
  category?: string;
  recurring?: "daily" | "weekly" | "monthly" | "none";
  linkedToFocusSession?: string;
  createdAt: string;
  completedAt?: string;
  order: number;
}

export interface FocusSession {
  id: string;
  startTime: string;
  endTime?: string;
  focusDuration: number;
  breakDuration: number;
  isCompleted: boolean;
  linkedTaskIds: string[];
  type: "focus" | "break";
}

export interface Gamification {
  points: number;
  level: number;
  totalStreak: number;
  currentStreak: number;
  badges: string[];
  lastActivityDate: string;
}

export interface MindfulnessSession {
  id: string;
  duration: number;
  completedAt: string;
  type: "breathing" | "meditation";
}

interface AppDataContextType {
  tasks: Task[];
  focusSessions: FocusSession[];
  gamification: Gamification;
  mindfulnessSessions: MindfulnessSession[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "order">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (taskIds: string[]) => void;
  addFocusSession: (session: Omit<FocusSession, "id">) => FocusSession;
  completeFocusSession: (id: string) => void;
  addMindfulnessSession: (session: Omit<MindfulnessSession, "id">) => MindfulnessSession;
  addPoints: (amount: number) => void;
  addBadge: (badge: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const DEFAULT_GAMIFICATION: Gamification = {
  points: 0,
  level: 1,
  totalStreak: 0,
  currentStreak: 0,
  badges: [],
  lastActivityDate: new Date().toISOString().split("T")[0],
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [gamification, setGamification] = useState<Gamification>(DEFAULT_GAMIFICATION);
  const [mindfulnessSessions, setMindfulnessSessions] = useState<MindfulnessSession[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("adhd_tasks");
    const storedSessions = localStorage.getItem("adhd_focus_sessions");
    const storedGamification = localStorage.getItem("adhd_gamification");
    const storedMindfulness = localStorage.getItem("adhd_mindfulness_sessions");

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedSessions) setFocusSessions(JSON.parse(storedSessions));
    if (storedGamification) setGamification(JSON.parse(storedGamification));
    if (storedMindfulness) setMindfulnessSessions(JSON.parse(storedMindfulness));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("adhd_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("adhd_focus_sessions", JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    localStorage.setItem("adhd_gamification", JSON.stringify(gamification));
  }, [gamification]);

  useEffect(() => {
    localStorage.setItem("adhd_mindfulness_sessions", JSON.stringify(mindfulnessSessions));
  }, [mindfulnessSessions]);

  const addTask = (task: Omit<Task, "id" | "createdAt" | "order">) => {
    const newTask: Task = {
      ...task,
      id: "task_" + Date.now(),
      createdAt: new Date().toISOString(),
      order: tasks.length,
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const reorderTasks = (taskIds: string[]) => {
    const reordered = taskIds
      .map((id) => tasks.find((t) => t.id === id))
      .filter(Boolean) as Task[];
    setTasks(reordered.map((t, i) => ({ ...t, order: i })));
  };

  const addFocusSession = (session: Omit<FocusSession, "id">) => {
    const newSession: FocusSession = {
      ...session,
      id: "session_" + Date.now(),
    };
    setFocusSessions([...focusSessions, newSession]);
    return newSession;
  };

  const completeFocusSession = (id: string) => {
    const session = focusSessions.find((s) => s.id === id);
    if (session && session.type === "focus") {
      const durationMinutes = Math.floor((session.focusDuration || 25) / 60);
      addPoints(durationMinutes * 10);
      updateStreaks();
    }
    setFocusSessions(
      focusSessions.map((s) =>
        s.id === id ? { ...s, isCompleted: true, endTime: new Date().toISOString() } : s
      )
    );
  };

  const addMindfulnessSession = (session: Omit<MindfulnessSession, "id">) => {
    const newSession: MindfulnessSession = {
      ...session,
      id: "mindfulness_" + Date.now(),
    };
    setMindfulnessSessions([...mindfulnessSessions, newSession]);
    addPoints(5);
    return newSession;
  };

  const addPoints = (amount: number) => {
    setGamification((prev) => {
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newPoints / 500) + 1;
      return { ...prev, points: newPoints, level: newLevel };
    });
  };

  const addBadge = (badge: string) => {
    setGamification((prev) =>
      prev.badges.includes(badge) ? prev : { ...prev, badges: [...prev.badges, badge] }
    );
  };

  const updateStreaks = () => {
    const today = new Date().toISOString().split("T")[0];
    const lastDay = gamification.lastActivityDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let newStreak = gamification.currentStreak;
    if (lastDay !== today) {
      if (lastDay === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    setGamification((prev) => ({
      ...prev,
      currentStreak: newStreak,
      totalStreak: Math.max(prev.totalStreak, newStreak),
      lastActivityDate: today,
    }));
  };

  return (
    <AppDataContext.Provider
      value={{
        tasks,
        focusSessions,
        gamification,
        mindfulnessSessions,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        addFocusSession,
        completeFocusSession,
        addMindfulnessSession,
        addPoints,
        addBadge,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
};
