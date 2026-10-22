import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { User, Mail, Phone, Building, Briefcase, Calendar } from "lucide-react";

export default async function EmployeeProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const dbUser = memoryStore.getUserById(user.id);
  const tasks = memoryStore.getTasksByAssignedUser(user.id);
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Engineer Profile</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Your DotTech account details and authorized assignments.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user.fullName}</h3>
            <p className="text-xs text-slate-500">{user.designation} • {user.department}</p>
            <span className="inline-block mt-2 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              Employee ID: {user.employeeId}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Email Address</span>
            <span className="font-semibold text-slate-800">{user.email}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Role Permission</span>
            <span className="font-semibold text-slate-800">{user.role}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Assigned Tasks</span>
            <span className="font-semibold text-slate-800">{tasks.length} total ({completed} completed)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Account Status</span>
            <span className="font-semibold text-emerald-600">{user.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
