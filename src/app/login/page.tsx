"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("santhoshmanibau2006@gmail.com");
  const [password, setPassword] = useState("Mani0303@");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Hard redirect to guarantee cookies and server components re-evaluate cleanly
      if (data.user.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/employee/dashboard";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
      setLoading(false);
    }
  };

  const setCredentials = (role: "santhosh" | "admin" | "alex" | "marcus") => {
    if (role === "santhosh") {
      setEmail("santhoshmanibau2006@gmail.com");
      setPassword("Mani0303@");
    } else if (role === "admin") {
      setEmail("admin@dottech.com");
      setPassword("password123");
    } else if (role === "alex") {
      setEmail("alex@dottech.com");
      setPassword("password123");
    } else {
      setEmail("marcus@dottech.com");
      setPassword("password123");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            src="/company-logo.svg"
            alt="DotTech Solutions Logo"
            className="w-14 h-14 rounded-2xl shadow-lg ring-1 ring-slate-900/10 object-contain hover:scale-105 transition-transform"
          />
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          Sign in to DotTech Flow
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-600">
          Internal Task Management & Code Review Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 border border-slate-200 rounded-xl shadow-xs">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  placeholder="name@dottech.com"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <a href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              <span>{loading ? "Authenticating..." : "Sign in to Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Quick Role Test Credentials
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setCredentials("santhosh")}
                className="px-2 py-1.5 text-xs font-semibold border border-purple-200 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-center truncate"
              >
                Santhosh (Admin)
              </button>
              <button
                type="button"
                onClick={() => setCredentials("admin")}
                className="px-2 py-1.5 text-xs font-medium border border-blue-200 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
              >
                Sarah (Admin)
              </button>
              <button
                type="button"
                onClick={() => setCredentials("alex")}
                className="px-2 py-1.5 text-xs font-medium border border-slate-200 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-center"
              >
                Alex (Emp)
              </button>
              <button
                type="button"
                onClick={() => setCredentials("marcus")}
                className="px-2 py-1.5 text-xs font-medium border border-slate-200 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-center"
              >
                Marcus (Emp)
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-500">
              Default password: <code className="bg-slate-100 px-1 py-0.5 rounded">password123</code>
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured with HttpOnly session cookies & role-based access control</span>
        </div>
      </div>
    </div>
  );
}
