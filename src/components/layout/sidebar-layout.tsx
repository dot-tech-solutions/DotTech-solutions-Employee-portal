"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  Users,
  FileCode2,
  BarChart3,
  Bell,
  Settings,
  History,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface SidebarProps {
  role: "ADMIN" | "EMPLOYEE";
  userName: string;
  userEmail: string;
  userDesignation?: string;
}

export function SidebarLayout({
  role,
  userName,
  userEmail,
  userDesignation,
  children,
}: SidebarProps & { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const adminNav: NavigationItem[] = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { name: "Tasks", href: "/admin/tasks", icon: CheckSquare },
    { name: "Code Reviews", href: "/admin/reviews", icon: FileCode2 },
    { name: "Employees", href: "/admin/employees", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Integrations", href: "/admin/integrations", icon: ExternalLink },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const employeeNav: NavigationItem[] = [
    { name: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
    { name: "My Tasks", href: "/employee/my-tasks", icon: CheckSquare },
    { name: "My Submissions", href: "/employee/submissions", icon: FileCode2 },
    { name: "Notifications", href: "/employee/notifications", icon: Bell },
    { name: "My Profile", href: "/employee/profile", icon: Settings },
  ];

  const currentNav = role === "ADMIN" ? adminNav : employeeNav;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link href={role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard"} className="flex items-center gap-3">
            <img
              src="/company-logo.svg"
              alt="DotTech Solutions"
              className="w-9 h-9 rounded-xl shadow-xs ring-1 ring-slate-900/10 object-contain shrink-0"
            />
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-sm">DotTech Flow</span>
              <span className="block text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
                {role === "ADMIN" ? "Admin Console" : "Employee Portal"}
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {role === "ADMIN" ? "Workspace Management" : "My Workspace"}
          </div>
          {currentNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && item.href !== "/employee/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    active ? "text-blue-700" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span className="flex-1 truncate">{item.name}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
              </Link>
            );
          })}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-slate-200/60 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 truncate">{userName}</p>
              <p className="text-[11px] text-slate-500 truncate">{userDesignation || userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-md transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <img
                src="/company-logo.svg"
                alt="DotTech Logo"
                className="w-7 h-7 rounded-lg ring-1 ring-slate-900/10 object-contain shadow-2xs"
              />
              <h1 className="text-sm sm:text-base font-semibold text-slate-900">DotTech Solutions Portal</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={role === "ADMIN" ? "/admin/notifications" : "/employee/notifications"}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
            </Link>

            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
              {role === "ADMIN" ? "Admin" : "Employee"}
            </span>
          </div>
        </header>

        {/* Page Children */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
