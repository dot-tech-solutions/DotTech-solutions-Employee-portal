import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate, isOverdue } from "@/lib/utils";
import { CheckSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmployeeMyTasksPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const tasks = memoryStore.getTasksByAssignedUser(user.id);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">My Assigned Tasks</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          View task criteria, submit implementation deliverables, and resolve code review feedback.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Tasks ({tasks.length})</span>
        </div>

        <div className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const project = memoryStore.getProjectById(task.projectId);
            const overdue = isOverdue(task.dueDate, task.status);

            return (
              <div key={task.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{task.taskCode}</span>
                    <Link href={`/employee/tasks/${task.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-600">
                      {task.title}
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Project: {project?.name}</span>
                    <span>•</span>
                    <span className={overdue ? "text-red-600 font-bold" : ""}>
                      Due: {formatDate(task.dueDate)} {overdue && "(Overdue)"}
                    </span>
                    <span>•</span>
                    <span>Weight: {task.weight}x</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                  <Link
                    href={`/employee/tasks/${task.id}`}
                    className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {task.status === "CHANGES_REQUESTED" ? "Resolve & Resubmit" : "Open Task"}
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
