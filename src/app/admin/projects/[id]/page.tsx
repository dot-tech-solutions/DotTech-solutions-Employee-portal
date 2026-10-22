import Link from "next/link";
import { notFound } from "next/navigation";
import { memoryStore } from "@/lib/store";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate, calculateProjectProgress } from "@/lib/utils";
import { ArrowLeft, Plus, FolderGit2, Calendar, CheckSquare } from "lucide-react";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = memoryStore.getProjectById(id);
  if (!project) notFound();

  const tasks = memoryStore.getTasksByProject(project.id);
  const progress = calculateProjectProgress(tasks);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Projects</span>
      </Link>

      {/* Project Overview Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600">[{project.projectCode}]</span>
              <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{project.description}</p>
          </div>
          <Link
            href={`/admin/tasks/new?projectId=${project.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors self-start"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </Link>
        </div>

        {/* Progress & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Repository</span>
            <span className="font-mono text-slate-700">{project.githubRepo || "None connected"}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Target Deadline</span>
            <span className="font-medium text-slate-700">{formatDate(project.deadline)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Weighted Progress</span>
            <span className="font-bold text-blue-600">{progress}%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Tasks Count</span>
            <span className="font-medium text-slate-700">{tasks.length} total</span>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-xs font-semibold text-slate-700">Project Deliverables ({tasks.length})</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {tasks.map((t) => {
            const assignee = memoryStore.getUserById(t.assignedToId);
            return (
              <div key={t.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600">{t.taskCode}</span>
                    <Link href={`/admin/tasks/${t.id}`} className="font-semibold text-slate-900 hover:text-blue-600">
                      {t.title}
                    </Link>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assigned to: <span className="font-medium text-slate-700">{assignee?.fullName || "Unassigned"}</span> • Due: {formatDate(t.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                  <Link
                    href={`/admin/tasks/${t.id}`}
                    className="px-2.5 py-1 text-slate-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded"
                  >
                    Manage
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
