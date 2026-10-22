"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [taskCode, setTaskCode] = useState("");
  const [description, setDescription] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [expectedDeliverable, setExpectedDeliverable] = useState("");
  const [weight, setWeight] = useState("2.0");
  const [priority, setPriority] = useState<any>("HIGH");
  const [projectId, setProjectId] = useState("proj_1");
  const [assignedToId, setAssignedToId] = useState("usr_emp_1");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("16");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          taskCode,
          description,
          acceptanceCriteria,
          expectedDeliverable,
          weight: parseFloat(weight) || 1.0,
          priority,
          projectId,
          assignedToId,
          dueDate,
          estimatedHours: parseFloat(estimatedHours) || 8,
        }),
      });

      if (res.ok) {
        router.push("/admin/tasks");
        router.refresh();
      } else {
        alert("Failed to create task");
      }
    } catch {
      alert("Error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/tasks"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Tasks</span>
      </Link>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Assign New Task</h2>
        <p className="text-xs text-slate-500 mb-6">
          Define deliverables, acceptance criteria, and assign to engineering personnel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                placeholder="e.g. Implement WebAuthn Passkey Registration"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Task Code</label>
              <input
                type="text"
                required
                value={taskCode}
                onChange={(e) => setTaskCode(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
                placeholder="TASK-106"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              placeholder="Technical specs, implementation context, and architecture..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Acceptance Criteria</label>
            <textarea
              rows={2}
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              placeholder="1. Must pass linting without warnings&#10;2. Coverage > 85%"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Deliverables</label>
            <input
              type="text"
              value={expectedDeliverable}
              onChange={(e) => setExpectedDeliverable(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              placeholder="GitHub Pull Request + Staging Demo URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option value="proj_1">Enterprise Single Sign-On & MFA</option>
                <option value="proj_2">Real-time Telemetry Pipeline</option>
                <option value="proj_3">Core Design System & UI Library</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option value="usr_emp_1">Alex Rivera (Senior Frontend)</option>
                <option value="usr_emp_2">Marcus Chen (Staff Backend)</option>
                <option value="usr_emp_3">Elena Rostova (DevOps)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Task Weight</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Hours</label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Link
              href="/admin/tasks"
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? "Assigning..." : "Assign Task"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
