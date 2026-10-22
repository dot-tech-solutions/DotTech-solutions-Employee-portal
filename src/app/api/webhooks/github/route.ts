import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, processGitHubWebhook } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");
    const event = req.headers.get("x-github-event") || "ping";
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET || "development-secret-test";

    // Verify signature if secret configured
    if (process.env.GITHUB_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    await processGitHubWebhook(event, payload);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process webhook" }, { status: 500 });
  }
}
