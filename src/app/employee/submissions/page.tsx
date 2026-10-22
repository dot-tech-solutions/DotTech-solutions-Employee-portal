import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ExternalLink, GitPullRequest } from "lucide-react";

export default async function EmployeeSubmissionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const mySubmissions = memoryStore.getSubmissions().filter((s) => s.employeeId === user.id);
  const tasks = memoryStore.getTasks();

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">My Submissions & Approvals</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          History of all code submissions, PR reviews, demo links, and reviewer decisions.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <span className="text-xs font-semibold text-slate-700">Submissions Log ({mySubmissions.length})</span>
        </div>

        <div className="divide-y divide-slate-100">
          {mySubmissions.length === 0 ? (
            <p className="p-6 text-xs text-slate-500 text-center">No submissions yet.</p>
          ) : (
            mySubmissions.map((sub) => {
              const task = tasks.find((t) => t.id === sub.taskId);
              const review = memoryStore.getReviewBySubmission(sub.id);

              return (
                <div key={sub.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{task?.taskCode}</span>
                      <Link href={`/employee/tasks/${sub.taskId}`} className="text-sm font-bold text-slate-900 hover:text-blue-600">
                        {task?.title}
                      </Link>
                      <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono">
                        v{sub.version}
                      </span>
                      <StatusBadge status={sub.status} />
                    </div>
                    <p className="text-xs text-slate-500">Submitted on {formatDate(sub.createdAt)}</p>

                    {review && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded mt-2 border border-slate-200/60">
                        <span className="font-semibold">Review: </span>
                        {review.generalFeedback}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/employee/tasks/${sub.taskId}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
