import crypto from "crypto";
import { memoryStore } from "@/lib/store";

export interface GitHubWebhookPayload {
  action: string;
  pull_request?: {
    id: number;
    number: number;
    title: string;
    state: string;
    html_url: string;
    head: { ref: string; sha: string };
    base: { ref: string };
    user: { login: string };
    merged: boolean;
  };
  repository?: {
    name: string;
    full_name: string;
  };
  sender?: {
    login: string;
  };
}

export function verifyWebhookSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = `sha256=${hmac.update(payload).digest("hex")}`;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch {
    return false;
  }
}

export async function processGitHubWebhook(event: string, payload: GitHubWebhookPayload) {
  // Prevent duplicate events
  const eventId = `${event}_${payload.pull_request?.id || Date.now()}_${payload.action}`;
  
  memoryStore.addAuditLog(
    "GITHUB_WEBHOOK_RECEIVED",
    "GitHubWebhook",
    eventId,
    `Received GitHub event: ${event}.${payload.action} for PR #${payload.pull_request?.number || "N/A"}`
  );

  // If a pull request was updated or synced, log review events
  if (event === "pull_request" && payload.pull_request) {
    const prUrl = payload.pull_request.html_url;
    // Check if any submission matches this PR
    const submissions = memoryStore.getSubmissions();
    const matchedSub = submissions.find((s) => s.pullRequestUrl === prUrl);
    
    if (matchedSub) {
      memoryStore.addAuditLog(
        "GITHUB_PR_SYNC",
        "Submission",
        matchedSub.id,
        `Synchronized PR status '${payload.pull_request.state}' (Merged: ${payload.pull_request.merged}). Task approval remains governed by explicit portal review workflow.`
      );
    }
  }

  return { success: true, processed: true };
}
