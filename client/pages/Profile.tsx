import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Lock,
  LogOut,
  Save,
  Edit2,
  Trophy,
  Flame,
  Zap,
} from "lucide-react";

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { gamification, tasks, focusSessions, mindfulnessSessions } = useAppData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalFocusTime = focusSessions.reduce((acc, s) => acc + (s.focusDuration || 0), 0);

  const handleSaveProfile = () => {
    if (formData.name && formData.email) {
      updateProfile({
        name: formData.name,
        email: formData.email,
      });
      setIsEditing(false);
    }
  };

  const handleChangePassword = () => {
    if (
      passwordData.newPassword &&
      passwordData.newPassword === passwordData.confirmPassword
    ) {
      // In a real app, this would call a backend API
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      // Show success message
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-slate-400">Manage your account settings</p>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-24 h-24 rounded-full border-4 border-cyan-400"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
              <p className="text-slate-400">{user?.email}</p>
              <p className="text-sm text-slate-500 mt-2">
                Member since{" "}
                {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-1">LEVEL</p>
            <p className="text-3xl font-bold text-purple-400">{gamification.level}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-1">POINTS</p>
            <p className="text-3xl font-bold text-yellow-400">{gamification.points}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-1">STREAK</p>
            <p className="text-3xl font-bold text-orange-400">{gamification.currentStreak}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400 mb-1">BADGES</p>
            <p className="text-3xl font-bold text-cyan-400">{gamification.badges.length}</p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Tasks</h3>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-cyan-400">{completedTasks}</p>
            <p className="text-xs text-slate-400">
              of {tasks.length} tasks completed
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Focus</h3>
              <Trophy className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">
              {Math.floor(totalFocusTime / 60)}h
            </p>
            <p className="text-xs text-slate-400">
              total focus time
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Mindfulness</h3>
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">{mindfulnessSessions.length}</p>
            <p className="text-xs text-slate-400">
              sessions completed
            </p>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              Account Information
            </h3>
            <Button
              onClick={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setIsEditing(true);
                }
              }}
              className={`${
                isEditing
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-slate-700 hover:bg-slate-600"
              } text-white`}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Full Name</p>
                <p className="text-lg text-white font-semibold">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="text-lg text-white font-semibold">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              Password
            </h3>
            <Button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-slate-700 hover:bg-slate-600 text-white"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </Button>
          </div>

          {showPasswordForm && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                className="bg-cyan-500 hover:bg-cyan-600 text-white w-full"
              >
                Update Password
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
