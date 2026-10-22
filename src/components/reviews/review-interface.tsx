"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  GitPullRequest,
  Code2,
  Send,
  MessageSquare,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";

interface Props {
  submission: any;
  task: any;
  employee: any;
  review: any;
  allVersions: any[];
}

export function ReviewInterfaceClient({ submission, task, employee, review, allVersions }: Props) {
  const router = useRouter();
  const [feedback, setFeedback] = useState(review?.generalFeedback || "");
  const [lineComment, setLineComment] = useState("");
  const [lineNumber, setLineNumber] = useState<number | "">("");
  const [filePath, setFilePath] = useState("src/auth/handler.ts");
  const [commentsList, setCommentsList] = useState<any[]>(review?.comments || []);
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = () => {
    if (!lineComment.trim()) return;
    setCommentsList([
      ...commentsList,
      {
        id: `local_${Date.now()}`,
        filePath,
        lineNumber: Number(lineNumber) || 1,
        comment: lineComment,
      },
    ]);
    setLineComment("");
    setLineNumber("");
  };

  const handleAction = async (action: "APPROVE" | "REQUEST_CHANGES" | "REJECT") => {
    if (!feedback.trim()) {
      alert("Please provide general review feedback before finalizing.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submission.id,
          action,
          generalFeedback: feedback,
          comments: commentsList,
        }),
      });

      if (res.ok) {
        router.refresh();
        alert(`Review successfully submitted as ${action}`);
      } else {
        alert("Failed to submit review");
      }
    } catch {
      alert("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/reviews"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Reviews</span>
      </Link>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600">{task?.taskCode}</span>
              <h2 className="text-xl font-bold text-slate-900">{task?.title}</h2>
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 font-mono rounded">
                Version {submission.version}
              </span>
              <StatusBadge status={submission.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Submitted by <span className="font-semibold text-slate-800">{employee?.fullName}</span> ({employee?.email})
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {submission.demoUrl && (
              <a
                href={submission.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Live Demo</span>
              </a>
            )}
            {submission.pullRequestUrl && (
              <a
                href={submission.pullRequestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors font-mono"
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>Open PR on GitHub</span>
              </a>
            )}
          </div>
        </div>

        {/* Task Requirements Snapshot */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200/60">
          <div>
            <span className="font-semibold text-slate-700 block mb-1">Acceptance Criteria</span>
            <p className="text-slate-600 whitespace-pre-wrap">{task?.acceptanceCriteria || "None specified"}</p>
          </div>
          <div>
            <span className="font-semibold text-slate-700 block mb-1">Employee Submission Notes</span>
            <p className="text-slate-600 whitespace-pre-wrap italic">&ldquo;{submission.notes || "No notes attached"}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Code Snippet / Diff Inspection Viewer */}
      {submission.codeSnippet && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-900 text-slate-200 flex items-center justify-between text-xs">
            <span className="font-mono flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Key Implementation Code / Snippet</span>
            </span>
            <span className="text-slate-400 text-[11px]">Read-only preview</span>
          </div>
          <pre className="p-4 bg-slate-950 text-slate-50 font-mono text-xs overflow-x-auto leading-relaxed">
            {submission.codeSnippet}
          </pre>
        </div>
      )}

      {/* Line-Specific Code Comments Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Line-Specific Code Review Comments</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">File Path</label>
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs"
              placeholder="src/auth.ts"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Line Number</label>
            <input
              type="number"
              value={lineNumber}
              onChange={(e) => setLineNumber(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              placeholder="e.g. 42"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Comment</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={lineComment}
                onChange={(e) => setLineComment(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                placeholder="Suggest change or point out defect..."
              />
              <button
                type="button"
                onClick={handleAddComment}
                className="px-3 py-1.5 bg-slate-800 text-white rounded font-semibold text-xs hover:bg-slate-900"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        {commentsList.length > 0 && (
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
            {commentsList.map((c, i) => (
              <div key={i} className="p-3 bg-slate-50/60 flex items-start justify-between text-xs">
                <div>
                  <span className="font-mono text-blue-600 font-semibold">{c.filePath}:{c.lineNumber}</span>
                  <p className="text-slate-800 mt-0.5">{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Final Decision & Actions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Review Outcome & Feedback</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            General Feedback & Guidance (Mandatory)
          </label>
          <textarea
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            placeholder="Document code review remarks, security validation findings, or reasons for approval/rework..."
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Explicit review approval triggers task completion and notifies the assigned employee.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleAction("REQUEST_CHANGES")}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Request Changes</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleAction("APPROVE")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Submission</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
