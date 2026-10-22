import Link from "next/link";
import { notFound } from "next/navigation";
import { memoryStore } from "@/lib/store";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Mail, Phone, Building, Briefcase, CheckCircle2 } from "lucide-react";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = memoryStore.getUserById(id);
  if (!user) notFound();

  const assignedTasks = memoryStore.getTasksByAssignedUser(user.id);
  const submissions = memoryStore.getSubmissions().filter((s) => s.employeeId === user.id);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/employees"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Employees</span>
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user.fullName}</h2>
              <StatusBadge status={user.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.designation} • {user.department}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user.phone}
                </span>
              )}
              <span className="font-mono text-slate-500">ID: {user.employeeId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Assigned */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Assigned Tasks ({assignedTasks.length})
        </h3>
        <div className="divide-y divide-slate-100">
          {assignedTasks.map((t) => (
            <div key={t.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900">{t.title}</span>
                <p className="text-slate-500 text-[11px]">Due: {formatDate(t.dueDate)} • Weight: {t.weight}x</p>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={t.priority} />
                <StatusBadge status={t.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
