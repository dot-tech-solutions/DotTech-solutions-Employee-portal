import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const review = memoryStore.createReview({
    submissionId: body.submissionId,
    reviewerId: user.id,
    action: body.action,
    generalFeedback: body.generalFeedback,
    rating: body.rating || 5,
    comments: body.comments || [],
  });

  return NextResponse.json({ review });
}
