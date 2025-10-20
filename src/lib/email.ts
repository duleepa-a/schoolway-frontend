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
export function renderPayrollSettlementEmail(
  recipientName: string,
  recipientRole: string,
  monthLabel: string,
  totals: {
    totalAmount: number;
    totalSystemFee: number;
    totalDriverShare: number;
    totalOwnerShare: number;
  },
  perVan: Array<{
    vanId: number;
    totalAmount: number;
    totalSystemFee: number;
    totalDriverShare: number;
    totalOwnerShare: number;
    students: Array<{
      childId: string;
      name: string;
      amountPaid: number;
      systemFee: number;
      driverShare: number;
      ownerShare: number;
    }>;
  }>
): string {
  const rows = perVan
    .map(
      (v) => `
        <div style="margin-top: 24px;">
          <h4 style="font-size:16px;margin:0 0 6px 0;font-weight:bold;color:#333;">
            Van #${v.vanId}
          </h4>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#f7f7f7;">
                <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">Student</th>
                <th style="text-align:right;padding:8px;border-bottom:1px solid #ddd;">Amount</th>
                <th style="text-align:right;padding:8px;border-bottom:1px solid #ddd;">System Fee</th>
                <th style="text-align:right;padding:8px;border-bottom:1px solid #ddd;">Driver Share</th>
                <th style="text-align:right;padding:8px;border-bottom:1px solid #ddd;">Owner Share</th>
              </tr>
            </thead>
            <tbody>
              ${v.students
                .map(
                  (s) => `
                    <tr style="border-bottom:1px solid #eee;">
                      <td style="padding:8px;">${escapeHtml(s.name)}</td>
                      <td style="padding:8px;text-align:right;">${s.amountPaid.toFixed(
                        2
                      )}</td>
                      <td style="padding:8px;text-align:right;">${s.systemFee.toFixed(
                        2
                      )}</td>
                      <td style="padding:8px;text-align:right;">${s.driverShare.toFixed(
                        2
                      )}</td>
                      <td style="padding:8px;text-align:right;">${s.ownerShare.toFixed(
                        2
                      )}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr style="font-weight:bold;background:#fafafa;">
                <td style="padding:8px;">Van Totals</td>
                <td style="padding:8px;text-align:right;">${v.totalAmount.toFixed(
                  2
                )}</td>
                <td style="padding:8px;text-align:right;">${v.totalSystemFee.toFixed(
                  2
                )}</td>
                <td style="padding:8px;text-align:right;">${v.totalDriverShare.toFixed(
                  2
                )}</td>
                <td style="padding:8px;text-align:right;">${v.totalOwnerShare.toFixed(
                  2
                )}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `
    )
    .join("");

  return `
    <div style="font-family:Arial, sans-serif; line-height:1.6; color:#222; font-size:14px;">
      <h2 style="font-size:22px;margin-bottom:16px;color:#222;">Payroll Settlement Notice</h2>

      <p style="margin:0 0 16px 0;">
        Hi <strong>${escapeHtml(recipientName || "")}</strong>,
      </p>

      <p style="margin:0 0 20px 0;">
        Your payroll for 
        <strong>${escapeHtml(monthLabel)}</strong> has been settled 
        as a <strong>${escapeHtml(recipientRole)}</strong>.
      </p>

      <h3 style="font-size:18px; margin:24px 0 12px 0; color:#333;">Summary</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <tr>
          <td style="padding:6px;">Total Collected</td>
          <td style="padding:6px;text-align:right;">${totals.totalAmount.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding:6px;">Total System Fees</td>
          <td style="padding:6px;text-align:right;">${totals.totalSystemFee.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding:6px;">Total Driver Share</td>
          <td style="padding:6px;text-align:right;">${totals.totalDriverShare.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding:6px;">Total Owner/Service Share</td>
          <td style="padding:6px;text-align:right;">${totals.totalOwnerShare.toFixed(
            2
          )}</td>
        </tr>
      </table>

      ${rows}

      <p style="margin-top:30px;">
        Thank you,<br>
        — SchoolWay Team
      </p>
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
