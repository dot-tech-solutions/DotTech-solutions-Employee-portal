import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate, isOverdue } from "@/lib/utils";
import { CheckSquare, Clock, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmployeeDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const allTasks = memoryStore.getTasksByAssignedUser(user.id);
  const mySubmissions = memoryStore.getSubmissions().filter((s) => s.employeeId === user.id);

  const inProgress = allTasks.filter((t) => t.status === "IN_PROGRESS");
  const inReview = allTasks.filter((t) => t.status === "IN_REVIEW");
  const changesReq = allTasks.filter((t) => t.status === "CHANGES_REQUESTED");
  const completed = allTasks.filter((t) => t.status === "COMPLETED");
  const overdue = allTasks.filter((t) => isOverdue(t.dueDate, t.status));

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Welcome back, {user.fullName}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {user.designation || "Software Engineer"} • {user.department || "DotTech Engineering"}
          </p>
        </div>
        <Link
          href="/employee/my-tasks"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
        >
          <span>View All My Tasks</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">In Progress</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">{inProgress.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">In Review</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{inReview.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Changes Req.</span>
          <p className="text-2xl font-bold text-orange-600 mt-1">{changesReq.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Completed</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{completed.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Overdue</span>
          <p className="text-2xl font-bold text-red-600 mt-1">{overdue.length}</p>
        </div>
      </div>

      {/* Immediate Attention Tasks */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Tasks Requiring Action</h3>
        <p className="text-xs text-slate-500 mb-4">
          Focus on tasks with requested changes or upcoming deadlines.
        </p>

        <div className="divide-y divide-slate-100">
          {allTasks
            .filter((t) => t.status !== "COMPLETED" && t.status !== "CANCELLED")
            .map((task) => {
              const project = memoryStore.getProjectById(task.projectId);
              const overdueFlag = isOverdue(task.dueDate, task.status);

              return (
                <div key={task.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-blue-600">{task.taskCode}</span>
                      <Link
                        href={`/employee/tasks/${task.id}`}
                        className="text-xs font-bold text-slate-900 hover:text-blue-600"
                      >
                        {task.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Project: {project?.name}</span>
                      <span>•</span>
                      <span className={overdueFlag ? "text-red-600 font-semibold" : ""}>
                        Due: {formatDate(task.dueDate)} {overdueFlag && "(Overdue)"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                    <Link
                      href={`/employee/tasks/${task.id}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {task.status === "CHANGES_REQUESTED" ? "Resubmit" : "Open Work"}
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
