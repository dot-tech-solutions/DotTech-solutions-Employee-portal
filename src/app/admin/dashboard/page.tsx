import Link from "next/link";
import {
  Users,
  FolderGit2,
  CheckSquare,
  Clock,
  AlertCircle,
  FileCode2,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { memoryStore } from "@/lib/store";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate, calculateProjectProgress, isOverdue } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const users = memoryStore.getUsers();
  const projects = memoryStore.getProjects();
  const tasks = memoryStore.getTasks();
  const submissions = memoryStore.getSubmissions();

  const activeEmployees = users.filter((u) => u.role === "EMPLOYEE" && u.status === "ACTIVE").length;
  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const pendingReviews = submissions.filter((s) => s.status === "PENDING_REVIEW" || s.status === "IN_REVIEW").length;
  const changesRequested = tasks.filter((t) => t.status === "CHANGES_REQUESTED").length;
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;

  const overallProgress = calculateProjectProgress(tasks);

  // Recent Submissions
  const recentSubmissions = submissions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Administrator Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics, review queues, and company-wide engineering velocity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/tasks/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Task</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active Staff</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeEmployees}</p>
          <p className="text-[11px] text-slate-500 mt-1">{users.length} total users</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeProjects}</p>
          <p className="text-[11px] text-slate-500 mt-1">{projects.length} registered</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Tasks</span>
            <CheckSquare className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">{completedTasks} completed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pending Reviews</span>
            <FileCode2 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{pendingReviews}</p>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting approval</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Changes Req.</span>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-600">{changesRequested}</p>
          <p className="text-[11px] text-slate-500 mt-1">Under rework</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Overdue Tasks</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
          <p className="text-[11px] text-red-500 font-medium mt-1">Requires attention</p>
        </div>
      </div>

      {/* Main Grid: Projects Progress & Pending Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Projects Overview with Weighted Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Project Delivery Progress</h3>
              <p className="text-xs text-slate-500">Calculated from weighted task completion</p>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => {
              const projTasks = tasks.filter((t) => t.projectId === proj.id);
              const progress = calculateProjectProgress(projTasks);
              return (
                <div key={proj.id} className="p-3.5 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/projects/${proj.id}`}
                        className="text-xs font-bold text-slate-900 hover:text-blue-600"
                      >
                        {proj.name}
                      </Link>
                      <span className="text-[10px] text-slate-400 font-mono">[{proj.projectCode}]</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{progress}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{projTasks.length} tasks ({projTasks.filter((t) => t.status === "COMPLETED").length} completed)</span>
                    <span>Deadline: {formatDate(proj.deadline)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Submissions Needing Review */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Submissions Queue</h3>
              <p className="text-xs text-slate-500">Awaiting code & demo review</p>
            </div>
            <Link
              href="/admin/reviews"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>All Reviews</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentSubmissions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No pending submissions</p>
            ) : (
              recentSubmissions.map((sub) => {
                const task = tasks.find((t) => t.id === sub.taskId);
                const emp = users.find((u) => u.id === sub.employeeId);
                return (
                  <div key={sub.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-900 truncate max-w-[180px]">
                        {task?.title || "Task"}
                      </span>
                      <StatusBadge status={sub.status} />
                    </div>
                    <div className="text-[11px] text-slate-500 mb-2">
                      by <span className="font-medium text-slate-700">{emp?.fullName}</span> • v{sub.version}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/reviews/${sub.id}`}
                        className="px-2.5 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-700 transition-colors inline-block"
                      >
                        Inspect & Review
                      </Link>
                      {sub.demoUrl && (
                        <a
                          href={sub.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-blue-600"
                          title="Open Demo URL"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
