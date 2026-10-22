import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function isOverdue(dueDateString?: string | null, status?: string): boolean {
  if (!dueDateString) return false;
  if (status === "COMPLETED" || status === "CANCELLED") return false;
  const due = new Date(dueDateString);
  const now = new Date();
  // Clear time component for date-only comparison
  due.setHours(23, 59, 59, 999);
  return due < now;
}

export function calculateProjectProgress(tasks: { weight: number; status: string }[]): number {
  const activeTasks = tasks.filter((t) => t.status !== "CANCELLED");
  if (activeTasks.length === 0) return 0;

  const totalWeight = activeTasks.reduce((acc, t) => acc + (t.weight || 1), 0);
  if (totalWeight === 0) return 0;

  const completedWeight = activeTasks
    .filter((t) => t.status === "COMPLETED")
    .reduce((acc, t) => acc + (t.weight || 1), 0);

  return Math.round((completedWeight / totalWeight) * 100);
}
