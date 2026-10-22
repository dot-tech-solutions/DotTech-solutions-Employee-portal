import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "purple" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variantStyles = {
    default: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-red-50 text-red-700 border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    outline: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
    case "APPROVED":
    case "ACTIVE":
      return <Badge variant="success">{status.replace("_", " ")}</Badge>;
    case "IN_PROGRESS":
    case "IN_REVIEW":
    case "PENDING_REVIEW":
      return <Badge variant="default">{status.replace("_", " ")}</Badge>;
    case "CHANGES_REQUESTED":
    case "ON_HOLD":
    case "PLANNING":
      return <Badge variant="warning">{status.replace("_", " ")}</Badge>;
    case "CANCELLED":
    case "REJECTED":
    case "INACTIVE":
      return <Badge variant="error">{status.replace("_", " ")}</Badge>;
    default:
      return <Badge variant="outline">{status.replace("_", " ")}</Badge>;
  }
}

export function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "URGENT":
      return <Badge variant="error">Urgent</Badge>;
    case "HIGH":
      return <Badge variant="warning">High</Badge>;
    case "MEDIUM":
      return <Badge variant="default">Medium</Badge>;
    case "LOW":
    default:
      return <Badge variant="outline">Low</Badge>;
  }
}
