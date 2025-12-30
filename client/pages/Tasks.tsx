import { useState } from "react";
import Layout from "@/components/Layout";
import { useAppData } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
  Filter,
  Search,
  Calendar,
  Flag,
  Tag,
} from "lucide-react";

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "",
    dueDate: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      if (editingId) {
        updateTask(editingId, {
          ...formData,
          status: "pending",
        });
        setEditingId(null);
      } else {
        addTask({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          category: formData.category || undefined,
          dueDate: formData.dueDate || undefined,
          status: "pending",
        });
      }
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: "",
        dueDate: "",
      });
      setShowForm(false);
    }
  };

  const handleEdit = (task: any) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      category: task.category || "",
      dueDate: task.dueDate || "",
    });
    setEditingId(task.id);
    setShowForm(true);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = !filterPriority || task.priority === filterPriority;
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesCategory = !filterCategory || task.category === filterCategory;

    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  const priorities = ["low", "medium", "high"];
  const statuses = ["pending", "in-progress", "completed"];
  const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))];

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-slate-400">Manage your tasks and boost productivity</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Filter Priority */}
          <select
            value={filterPriority || ""}
            onChange={(e) => setFilterPriority(e.target.value || null)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
          >
            <option value="">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus || ""}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          {/* Add Task Button */}
          <Button
            onClick={() => {
              setShowForm(!showForm);
              if (editingId) setEditingId(null);
            }}
            className="bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? "Cancel" : "New Task"}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Task Title
                </label>
                <Input
                  placeholder="What needs to be done?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Add details..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Category
                  </label>
                  <Input
                    placeholder="Work, Personal, etc."
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white font-semibold"
                >
                  {editingId ? "Update Task" : "Add Task"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        title: "",
                        description: "",
                        priority: "medium",
                        category: "",
                        dueDate: "",
                      });
                    }}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={(e) => {
                      updateTask(task.id, {
                        status: e.target.checked ? "completed" : "pending",
                      });
                    }}
                    className="mt-1 w-5 h-5 accent-cyan-400 cursor-pointer"
                  />

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold ${
                        task.status === "completed"
                          ? "line-through text-slate-500"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                      {task.priority && (
                        <span
                          className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                            task.priority === "high"
                              ? "bg-red-500/20 text-red-400"
                              : task.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          <Flag className="w-3 h-3" />
                          {task.priority}
                        </span>
                      )}
                      {task.category && (
                        <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {task.category}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          task.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-slate-400 hover:text-slate-300" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No tasks found. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
