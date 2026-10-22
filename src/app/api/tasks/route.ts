import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const task = memoryStore.createTask({
    title: body.title,
    taskCode: body.taskCode,
    description: body.description,
    acceptanceCriteria: body.acceptanceCriteria,
    expectedDeliverable: body.expectedDeliverable,
    weight: body.weight || 1.0,
    priority: body.priority || "MEDIUM",
    status: "TODO",
    projectId: body.projectId,
    assignedToId: body.assignedToId,
    createdById: user.id,
    dueDate: body.dueDate,
    estimatedHours: body.estimatedHours || 8,
  });

  return NextResponse.json({ task });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...updates } = body;

  const task = memoryStore.updateTask(id, updates, user.id);
  return NextResponse.json({ task });
}
