import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Enforce task assignment authorization: Employee can only submit for their own assigned tasks
  const task = memoryStore.getTaskById(body.taskId);
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  if (user.role !== "ADMIN" && task.assignedToId !== user.id) {
    return NextResponse.json({ error: "Forbidden: You are not assigned to this task" }, { status: 403 });
  }

  const sub = memoryStore.createSubmission({
    taskId: body.taskId,
    employeeId: user.id,
    demoUrl: body.demoUrl,
    pullRequestUrl: body.pullRequestUrl,
    repoBranch: body.repoBranch,
    codeSnippet: body.codeSnippet,
    notes: body.notes,
  });

  return NextResponse.json({ submission: sub });
}
