import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const project = memoryStore.createProject({
    projectCode: body.projectCode,
    name: body.name,
    description: body.description,
    githubRepo: body.githubRepo,
    priority: body.priority || "MEDIUM",
    status: "ACTIVE",
    startDate: new Date().toISOString().split("T")[0],
    deadline: body.deadline,
    createdById: user.id,
    memberIds: body.memberIds || [],
  });

  return NextResponse.json({ project });
}
