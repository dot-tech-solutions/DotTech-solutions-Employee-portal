import Link from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white p-8 border border-slate-200 rounded-xl shadow-xs text-center">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Access Denied (403)</h1>
        <p className="text-sm text-slate-600 mb-6">
          You do not have administrative privileges to access this page. This action has been logged for audit compliance.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/employee/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Employee Dashboard
          </a>
          <a
            href="/login"
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Switch Account
          </a>
        </div>
      </div>
    </div>
  );
}
