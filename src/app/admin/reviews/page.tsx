import Link from "next/link";
import { memoryStore } from "@/lib/store";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { FileCode2, ExternalLink, GitPullRequest } from "lucide-react";

export default function AdminReviewsPage() {
  const submissions = memoryStore.getSubmissions();
  const tasks = memoryStore.getTasks();
  const users = memoryStore.getUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Code & Demo Reviews</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit employee submissions, review pull requests, inspect demo environments, and record approvals.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Submissions Queue ({submissions.length})</span>
        </div>

        <div className="divide-y divide-slate-100">
          {submissions.map((sub) => {
            const task = tasks.find((t) => t.id === sub.taskId);
            const employee = users.find((u) => u.id === sub.employeeId);
            const review = memoryStore.getReviewBySubmission(sub.id);

            return (
              <div key={sub.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{task?.taskCode}</span>
                    <Link href={`/admin/reviews/${sub.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-600">
                      {task?.title}
                    </Link>
                    <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono">
                      v{sub.version}
                    </span>
                    <StatusBadge status={sub.status} />
                  </div>

                  <p className="text-xs text-slate-500">
                    Submitted by <span className="font-semibold text-slate-800">{employee?.fullName}</span> on {formatDate(sub.createdAt)}
                  </p>

                  <div className="flex items-center gap-4 text-xs pt-1">
                    {sub.demoUrl && (
                      <a
                        href={sub.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Demo Environment</span>
                      </a>
                    )}
                    {sub.pullRequestUrl && (
                      <a
                        href={sub.pullRequestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-600 font-mono"
                      >
                        <GitPullRequest className="w-3.5 h-3.5" />
                        <span>GitHub PR</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/reviews/${sub.id}`}
                    className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
                  >
                    Open Review Console
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
