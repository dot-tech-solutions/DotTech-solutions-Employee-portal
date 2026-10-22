import Link from "next/link";
import { notFound } from "next/navigation";
import { memoryStore } from "@/lib/store";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate, isOverdue } from "@/lib/utils";
import { ArrowLeft, ExternalLink, GitPullRequest, History, Clock } from "lucide-react";

export default async function AdminTaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = memoryStore.getTaskById(id);
  if (!task) notFound();

  const project = memoryStore.getProjectById(task.projectId);
  const assignee = memoryStore.getUserById(task.assignedToId);
  const submissions = memoryStore.getSubmissionsByTask(task.id);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/tasks"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Tasks</span>
      </Link>

      {/* Task Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600">{task.taskCode}</span>
              <h2 className="text-xl font-bold text-slate-900">{task.title}</h2>
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Project: <span className="font-semibold text-slate-700">{project?.name}</span> • Weight: {task.weight}x
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Due Date</span>
            <span className={`text-xs font-bold ${overdue ? "text-red-600" : "text-slate-800"}`}>
              {formatDate(task.dueDate)} {overdue && "(Overdue)"}
            </span>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-4 space-y-3 text-xs">
          <div>
            <h4 className="font-semibold text-slate-700">Description</h4>
            <p className="text-slate-600 mt-0.5 whitespace-pre-wrap">{task.description}</p>
          </div>
          {task.acceptanceCriteria && (
            <div>
              <h4 className="font-semibold text-slate-700">Acceptance Criteria</h4>
              <p className="text-slate-600 mt-0.5 whitespace-pre-wrap">{task.acceptanceCriteria}</p>
            </div>
          )}
          {task.expectedDeliverable && (
            <div>
              <h4 className="font-semibold text-slate-700">Expected Deliverables</h4>
              <p className="text-slate-600 mt-0.5">{task.expectedDeliverable}</p>
            </div>
          )}
        </div>
      </div>

      {/* Submissions & Versions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Submission History ({submissions.length} versions)
        </h3>

        {submissions.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 italic">No work submitted yet by engineer.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const review = memoryStore.getReviewBySubmission(sub.id);
              return (
                <div key={sub.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">Version {sub.version}</span>
                      <StatusBadge status={sub.status} />
                    </div>
                    <span className="text-[11px] text-slate-400">{formatDate(sub.createdAt)}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                    {sub.demoUrl && (
                      <a
                        href={sub.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo URL</span>
                      </a>
                    )}
                    {sub.pullRequestUrl && (
                      <a
                        href={sub.pullRequestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-mono"
                      >
                        <GitPullRequest className="w-3.5 h-3.5" />
                        <span>Pull Request</span>
                      </a>
                    )}
                  </div>

                  {sub.notes && <p className="text-xs text-slate-600 mt-1 italic">&ldquo;{sub.notes}&rdquo;</p>}

                  {review && (
                    <div className="mt-3 p-3 bg-white border border-slate-200 rounded text-xs space-y-1">
                      <span className="font-semibold text-slate-700">Review Outcome: {review.action}</span>
                      <p className="text-slate-600">{review.generalFeedback}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <Link
                      href={`/admin/reviews/${sub.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 inline-block"
                    >
                      Open Full Code Review Interface
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
