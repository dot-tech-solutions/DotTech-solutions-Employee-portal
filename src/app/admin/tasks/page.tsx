import Link from "next/link";
import { memoryStore } from "@/lib/store";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate, isOverdue } from "@/lib/utils";
import { Plus, CheckSquare, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminTasksPage() {
  const tasks = memoryStore.getTasks();
  const projects = memoryStore.getProjects();
  const users = memoryStore.getUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Task Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor all company tasks, assignees, deadlines, and review gates.
          </p>
        </div>
        <Link
          href="/admin/tasks/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Assign New Task</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">All Company Tasks ({tasks.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Task</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {tasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                const assignee = users.find((u) => u.id === task.assignedToId);
                const overdue = isOverdue(task.dueDate, task.status);

                return (
                  <tr key={task.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600">{task.taskCode}</span>
                        <Link href={`/admin/tasks/${task.id}`} className="font-semibold text-slate-900 hover:text-blue-600 line-clamp-1">
                          {task.title}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{project?.name || "N/A"}</td>
                    <td className="py-3 px-4">
                      {assignee ? (
                        <span className="font-medium text-slate-800">{assignee.fullName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="py-3 px-4">
                      <span className={overdue ? "text-red-600 font-bold" : "text-slate-600"}>
                        {formatDate(task.dueDate)} {overdue && "(!)"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/tasks/${task.id}`}
                        className="px-2.5 py-1 text-slate-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded transition-colors"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
