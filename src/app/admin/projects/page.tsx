import Link from "next/link";
import { memoryStore } from "@/lib/store";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate, calculateProjectProgress } from "@/lib/utils";
import { Plus, FolderGit2, Users, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ProjectsListPage() {
  const projects = memoryStore.getProjects();
  const tasks = memoryStore.getTasks();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Projects Portfolio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage company projects, team allocation, repositories, and completion milestones.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Project</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const progress = calculateProjectProgress(projTasks);

          return (
            <div key={proj.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] font-bold text-blue-600">{proj.projectCode}</span>
                  <StatusBadge status={proj.status} />
                </div>
                <Link
                  href={`/admin/projects/${proj.id}`}
                  className="text-sm font-bold text-slate-900 hover:text-blue-600 line-clamp-1"
                >
                  {proj.name}
                </Link>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{proj.description}</p>

                {proj.githubRepo && (
                  <div className="mt-3 text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-200/60 truncate">
                    Repo: {proj.githubRepo}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{projTasks.length} tasks</span>
                  <span>Deadline: {formatDate(proj.deadline)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
