import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notifs = memoryStore.getNotifications(user.id);
  return NextResponse.json({ notifications: notifs });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (body.action === "mark_all_read") {
    memoryStore.markAllNotificationsRead(user.id);
    return NextResponse.json({ success: true });
  }
  if (body.notificationId) {
    memoryStore.markNotificationRead(body.notificationId);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
