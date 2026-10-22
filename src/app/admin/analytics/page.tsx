import { memoryStore } from "@/lib/store";
import { calculateProjectProgress } from "@/lib/utils";
import { BarChart3, TrendingUp, CheckCircle, Clock, Users } from "lucide-react";

export default function AnalyticsPage() {
  const projects = memoryStore.getProjects();
  const tasks = memoryStore.getTasks();
  const users = memoryStore.getUsers().filter((u) => u.role === "EMPLOYEE");
  const submissions = memoryStore.getSubmissions();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const companyProgress = calculateProjectProgress(tasks);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Engineering Analytics & Velocity</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Formula: Weighted Approved Tasks ÷ Total Included Task Weight × 100 (excluding cancelled).
          </p>
        </div>
      </div>

      {/* Top Velocity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Overall Company Velocity</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-blue-600">{companyProgress}%</span>
            <span className="text-xs text-slate-500">completion rate</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${companyProgress}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Delivery Throughput</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-emerald-600">{completedTasks}</span>
            <span className="text-xs text-slate-500">of {totalTasks} tasks approved</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Excludes work undergoing changes</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Code Reviews Recorded</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900">{submissions.length}</span>
            <span className="text-xs text-slate-500">audited iterations</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Append-only submission versioning</p>
        </div>
      </div>

      {/* Employee-wise Workload Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Engineer Allocation & Performance</h3>

        <div className="divide-y divide-slate-100">
          {users.map((emp) => {
            const empTasks = tasks.filter((t) => t.assignedToId === emp.id);
            const empCompleted = empTasks.filter((t) => t.status === "COMPLETED").length;
            const empRate = calculateProjectProgress(empTasks);

            return (
              <div key={emp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {emp.fullName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-slate-900">{emp.fullName}</span>
                    <p className="text-[11px] text-slate-500">{emp.designation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tasks Allocated</span>
                    <span className="font-semibold text-slate-800">{empTasks.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Approved</span>
                    <span className="font-semibold text-emerald-600">{empCompleted}</span>
                  </div>
                  <div className="w-32">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Rate</span>
                      <span className="font-bold">{empRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${empRate}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
