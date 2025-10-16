import nodemailer from "nodemailer";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;

  if (!host || !port || !user || !pass || !from) {
    throw new Error(
      "SMTP configuration is missing. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM"
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams): Promise<void> {
  const tx = getTransporter();
  const from = process.env.EMAIL_FROM as string;
  await tx.sendMail({ from, to, subject, html });
}

export function renderDriverApprovalEmail(firstName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>You're approved! 🎉</h2>
      <p>Hi ${firstName},</p>
      <p>Your driver application has been <strong>approved</strong>. You can now sign in and start using the SchoolWay platform.</p>
      <p>Welcome aboard!<br/>— SchoolWay Team</p>
    </div>
  `;
}

export function renderDriverRejectionEmail(
  firstName: string,
  reason?: string
): string {
  const reasonBlock =
    reason && reason.trim().length > 0
      ? `<p><strong>Reason:</strong> ${escapeHtml(reason)}</p>`
      : "";
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Application update</h2>
      <p>Hi ${firstName},</p>
      <p>We appreciate your interest in joining SchoolWay. After review, your application was <strong>not approved</strong> at this time.</p>
      ${reasonBlock}
      <p>You may update your information and re-apply in the future.</p>
      <p>Thank you,<br/>— SchoolWay Team</p>
    </div>
  `;
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
