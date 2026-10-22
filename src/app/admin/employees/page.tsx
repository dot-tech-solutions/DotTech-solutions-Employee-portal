"use client";

import Link from "next/link";
import { memoryStore } from "@/lib/store";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { UserPlus, Search, Mail, Phone, Shield } from "lucide-react";

export default function EmployeesListPage() {
  const users = memoryStore.getUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Employee Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage engineers, role permissions, departments, and account statuses.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
          onClick={() => alert("Invite Employee flow ready in production.")}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Employee</span>
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Total Personnel ({users.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department & Designation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <Link
                          href={`/admin/employees/${user.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600"
                        >
                          {user.fullName}
                        </Link>
                        <p className="text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{user.employeeId}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        user.role === "ADMIN"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-900">{user.designation}</p>
                    <p className="text-[11px] text-slate-500">{user.department}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/employees/${user.id}`}
                      className="px-2.5 py-1 text-slate-700 hover:text-blue-600 font-medium hover:bg-blue-50 rounded transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
