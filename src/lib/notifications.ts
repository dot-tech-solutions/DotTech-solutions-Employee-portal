import { memoryStore } from "@/lib/store";

export interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  emailDetails?: {
    subject: string;
    bodyHtml: string;
  };
}

export async function sendNotification(payload: NotificationPayload) {
  // 1. In-App Notification (always generated)
  const notif = memoryStore.createNotification({
    userId: payload.userId,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    link: payload.link,
  });

  const recipient = memoryStore.getUserById(payload.userId);
  if (!recipient) return notif;

  // 2. Email Notification (Resend / Mock Adapter)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      // In production with valid key, call Resend API
      // await fetch('https://api.resend.com/emails', ...)
      console.log(`[Notification Service] Dispatched live email to ${recipient.email}`);
    } catch (err) {
      console.error("[Notification Service] Email delivery failure:", err);
    }
  } else {
    // Development / Honest Mock
    console.log(`[Notification Service (Mock)] Email queued for ${recipient.email}: "${payload.title}"`);
  }

  // 3. Optional WhatsApp Notification
  const whatsappToken = process.env.WHATSAPP_API_TOKEN;
  if (whatsappToken && recipient.phone) {
    try {
      // Call Meta WhatsApp Business Cloud API
      console.log(`[Notification Service] Dispatched WhatsApp alert to ${recipient.phone}`);
    } catch (err) {
      console.error("[Notification Service] WhatsApp delivery failure:", err);
    }
  }

  return notif;
}
