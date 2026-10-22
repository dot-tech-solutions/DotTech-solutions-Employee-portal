import { Shield, Key, Database, Bell, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Portal Security & Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Global company preferences, session timeouts, and security policies.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Company Information</h3>
          <p className="text-xs text-slate-500 mb-4">Identity displayed across review reports and automated emails.</p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                disabled
                defaultValue="DotTech Solutions Inc."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Domain</label>
              <input
                type="text"
                disabled
                defaultValue="dottechsolutions.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Review Approval Policy</h3>
          <p className="text-xs text-slate-500 mb-3">Governance rules enforced across task completions.</p>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked disabled className="rounded text-blue-600" />
              <span>Require explicit administrator sign-off before marking tasks completed</span>
            </label>
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked disabled className="rounded text-blue-600" />
              <span>Immutable append-only submission versioning (never overwrite past submissions)</span>
            </label>
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input type="checkbox" defaultChecked disabled className="rounded text-blue-600" />
              <span>Enforce HMAC SHA-256 verification on incoming GitHub webhooks</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
