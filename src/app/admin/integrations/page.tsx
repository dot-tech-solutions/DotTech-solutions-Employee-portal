"use client";

import { memoryStore } from "@/lib/store";
import { GitBranch, Mail, MessageSquare, CheckCircle2, AlertCircle, Key, Shield } from "lucide-react";

export default function IntegrationsPage() {
  const gh = memoryStore.getIntegration("github");
  const resend = memoryStore.getIntegration("resend");
  const whatsapp = memoryStore.getIntegration("whatsapp");

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Third-Party Integrations</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Connect GitHub Apps, configure transactional email delivery, and set up WhatsApp webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GitHub Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <GitBranch className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Connected
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">GitHub App</h3>
            <p className="text-xs text-slate-500 mt-1">
              Links organization repositories, pulls branch info, inspects pull requests, and validates webhook events.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] space-y-1 font-mono text-slate-600">
              <div>Org: dottech-solutions</div>
              <div>Connected Repos: 3 active</div>
              <div>Webhook Secret: Configured</div>
            </div>
          </div>

          <button
            className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
            onClick={() => alert("GitHub App configuration is active.")}
          >
            Configure Repositories
          </button>
        </div>

        {/* Resend Email Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Ready (Mock/Live)
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Resend Email Gateway</h3>
            <p className="text-xs text-slate-500 mt-1">
              Sends automated email notifications for task assignment, overdue alerts, and review decisions.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] space-y-1 text-slate-600">
              <div>Sender: notifications@dottechsolutions.com</div>
              <div>Delivery Strategy: Background Dispatch</div>
              <div>Fallback: Local Mock Service</div>
            </div>
          </div>

          <button
            className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
            onClick={() => alert("Email provider settings verified.")}
          >
            Email Templates & API Key
          </button>
        </div>

        {/* WhatsApp Business Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                Disconnected
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">WhatsApp Business API</h3>
            <p className="text-xs text-slate-500 mt-1">
              Optional integration for critical task assignment notifications and emergency deployment pings.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] space-y-1 text-slate-600">
              <div>Provider: Meta Cloud API</div>
              <div>Consent: Required per employee</div>
              <div>Status: Awaiting phone ID</div>
            </div>
          </div>

          <button
            className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
            onClick={() => alert("To connect WhatsApp: Provide WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env")}
          >
            Connect WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
