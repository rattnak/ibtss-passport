import { Resend } from "resend";
import { Station } from "./stations";

const resend = new Resend(process.env.RESEND_API_KEY);
// Use onboarding@resend.dev until a custom domain is verified in Resend dashboard
const FROM = "IBTSS Workshop <onboarding@resend.dev>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function sendStationResources(
  email: string,
  name: string,
  station: Station
) {
  const resourceList = station.resources
    .map((r) => `<li><a href="${r.url}" style="color:#2563eb;">${r.title}</a></li>`)
    .join("");

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${station.emoji} You visited Station ${station.id}: ${station.title}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1e293b,#0f172a);padding:32px;border-radius:16px 16px 0 0;">
          <p style="color:#fbbf24;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Fort Hays State University</p>
          <h1 style="color:white;margin:0;font-size:24px;">Stamp Collected! ${station.emoji}</h1>
        </div>
        <div style="padding:32px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
          <p style="color:#334155;">Hi ${name},</p>
          <p style="color:#334155;">You've just collected your stamp from <strong>${station.title}</strong> (${station.audience} Station).</p>
          <p style="color:#334155;">Here are your resources from this station:</p>
          <ul style="color:#334155;padding-left:20px;line-height:2;">${resourceList}</ul>
          <p style="color:#64748b;font-size:14px;">Keep visiting the remaining stations to complete your passport!</p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminMagicLink(email: string, verifyUrl: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your IBTSS admin sign-in link",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#000000;padding:32px;border-radius:16px 16px 0 0;">
          <p style="color:#F7A800;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Fort Hays State University · IBTSS 2026</p>
          <h1 style="color:white;margin:0;font-size:22px;">Admin Sign-In</h1>
        </div>
        <div style="padding:32px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
          <p style="color:#334155;">Click the button below to sign in to the station QR code admin area. This link expires in 15 minutes and can only be used once.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyUrl}" style="background:#F7A800;color:#000000;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">
              Sign In to Admin
            </a>
          </div>
          <p style="color:#94a3b8;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
}

export async function sendCompletionEmail(
  email: string,
  name: string,
  participantId: string
) {
  const passportUrl = `${BASE_URL}/passport/${participantId}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "🎉 You completed the IBTSS Digital Passport!",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1e293b,#0f172a);padding:32px;border-radius:16px 16px 0 0;">
          <p style="color:#fbbf24;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Fort Hays State University</p>
          <h1 style="color:white;margin:0;font-size:28px;">Passport Complete! 🎉</h1>
        </div>
        <div style="padding:32px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
          <p style="color:#334155;">Congratulations, ${name}!</p>
          <p style="color:#334155;">You've visited all three IBTSS workshop stations and earned your Digital Passport completion badge.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${passportUrl}" style="background:#2563eb;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;display:inline-block;">
              View & Share My Passport
            </a>
          </div>
          <p style="color:#64748b;font-size:14px;">Share your achievement on LinkedIn to inspire others and promote AI literacy at FHSU!</p>
        </div>
      </div>
    `,
  });
}
