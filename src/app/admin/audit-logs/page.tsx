import { memoryStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { History, Shield, User, Filter } from "lucide-react";

export default function AuditLogsPage() {
  const logs = memoryStore.getAuditLogs();
  const users = memoryStore.getUsers();

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Security & Activity Audit Logs</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable audit trail of administrative actions, permission mutations, review outcomes, and logins.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Audit Trail ({logs.length} events)</span>
          <span className="text-[11px] text-slate-500 font-mono">SOC2 / ISO Compliant Log Retention</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono">
              {logs.map((log) => {
                const actor = users.find((u) => u.id === log.userId);

                return (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium font-sans">
                      {log.entityType}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      {actor ? (
                        <span className="font-semibold text-slate-800">{actor.fullName}</span>
                      ) : (
                        <span className="text-slate-400 italic">System / Webhook</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600">
                      {log.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
