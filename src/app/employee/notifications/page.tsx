import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { Bell, CheckCheck } from "lucide-react";

export default async function EmployeeNotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifs = memoryStore.getNotifications(user.id);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Notifications</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time alerts for review feedback, assignment changes, and deadline milestones.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Inbox ({notifs.length})</span>
        </div>

        <div className="divide-y divide-slate-100">
          {notifs.length === 0 ? (
            <p className="p-8 text-xs text-slate-500 text-center">No notifications yet.</p>
          ) : (
            notifs.map((n) => (
              <div key={n.id} className={`p-4 flex items-start gap-3 text-xs ${n.isRead ? "bg-white" : "bg-blue-50/30"}`}>
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <span className="text-[11px] text-slate-400">{formatDateTime(n.createdAt)}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{n.message}</p>
                  {n.link && (
                    <Link href={n.link} className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:underline">
                      View details &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
