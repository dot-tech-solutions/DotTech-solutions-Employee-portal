"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  GitPullRequest,
  Send,
  AlertTriangle,
  CheckCircle2,
  Code2,
  FileText,
} from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Props {
  task: any;
  project: any;
  submissions: any[];
  reviews: any[];
  currentUser: any;
}

export function EmployeeTaskDetailClient({ task, project, submissions, reviews, currentUser }: Props) {
  const router = useRouter();
  const [demoUrl, setDemoUrl] = useState("");
  const [pullRequestUrl, setPullRequestUrl] = useState("");
  const [repoBranch, setRepoBranch] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoUrl && !pullRequestUrl && !codeSnippet) {
      alert("Please provide at least a Demo URL, GitHub PR URL, or code snippet.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          employeeId: currentUser.id,
          demoUrl,
          pullRequestUrl,
          repoBranch,
          codeSnippet,
          notes,
        }),
      });

      if (res.ok) {
        alert("Work submitted successfully for administrative code review!");
        router.refresh();
      } else {
        alert("Submission failed");
      }
    } catch {
      alert("Error submitting work");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/employee/my-tasks"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Tasks</span>
      </Link>

      {/* Task Overview */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
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
          <div className="text-xs text-slate-500">
            <span>Due Date: </span>
            <span className="font-bold text-slate-800">{formatDate(task.dueDate)}</span>
          </div>
        </div>

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

      {/* Review Feedback Alert if changes were requested */}
      {task.status === "CHANGES_REQUESTED" && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-950">Changes Requested by Reviewer</span>
            <p>
              Please address the code review remarks below, push updates, and submit a new version for re-approval.
            </p>
          </div>
        </div>
      )}

      {/* Submit Work Form */}
      {task.status !== "COMPLETED" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            {task.status === "CHANGES_REQUESTED" ? "Submit Revised Version" : "Submit Deliverables for Review"}
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Provide your live demo environment, GitHub pull request link, and implementation notes.
          </p>

          <form onSubmit={handleSubmitWork} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Live Demo URL (Staging / Preview)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900"
                    placeholder="https://preview.dottech.dev"
                  />
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GitHub Pull Request URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={pullRequestUrl}
                    onChange={(e) => setPullRequestUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
                    placeholder="https://github.com/dottech-solutions/repo/pull/42"
                  />
                  <GitPullRequest className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Code Snippet (Highlighted changes)
              </label>
              <textarea
                rows={3}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-900 text-slate-100 font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="// Paste key algorithms or handlers here..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Implementation Notes & Testing Steps
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900"
                placeholder="Details for the reviewer on how to verify credentials, test coverage, etc."
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? "Submitting..." : "Submit for Code Review"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Submission & Feedback History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Version History & Review Outcomes</h3>

        {submissions.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 italic">No previous submissions recorded.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const review = reviews.find((r) => r.submissionId === sub.id);
              return (
                <div key={sub.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Submission Version {sub.version}</span>
                    <StatusBadge status={sub.status} />
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs">
                    {sub.demoUrl && (
                      <a href={sub.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Live Demo
                      </a>
                    )}
                    {sub.pullRequestUrl && (
                      <a href={sub.pullRequestUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-mono">
                        GitHub PR
                      </a>
                    )}
                  </div>

                  {review && (
                    <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1">
                      <span className="font-bold text-slate-800">Admin Review Feedback:</span>
                      <p className="text-slate-600">{review.generalFeedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
