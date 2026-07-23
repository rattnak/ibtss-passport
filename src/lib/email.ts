import { Resend } from "resend";
import { Station } from "./stations";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "IBTSS Pre-Conference Workshop <noreply@rattnak.com>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function sendStationResources(
  email: string,
  name: string,
  station: Station
) {
  const resourceList = station.resources
    .map((r) => `<li><a href="${r.url}" style="color:#F7A800;">${r.title}</a></li>`)
    .join("");

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${station.emoji} You visited Station ${station.id}: ${station.title}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#000000;padding:32px;border-radius:16px 16px 0 0;">
          <p style="color:#F7A800;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Fort Hays State University · IBTSS 2026</p>
          <h1 style="color:white;margin:0;font-size:24px;">Stamp Collected! ${station.emoji}</h1>
        </div>
        <div style="padding:32px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
          <p style="color:#334155;">Hi ${name},</p>
          <p style="color:#334155;">You've just collected your stamp from <strong>${station.title}</strong> (${station.audience} Station).</p>
          <p style="color:#334155;">Here are your resources from this station:</p>
          <ul style="color:#334155;padding-left:20px;line-height:2;">${resourceList}</ul>
          <p style="color:#94a3b8;font-size:12px;">Keep visiting the remaining stations to complete your passport!</p>
        </div>
      </div>
    `,
  });
}

export async function sendParticipantVerifyLink(email: string, name: string, verifyUrl: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirm your IBTSS 2026 AI Learning Passport",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#000000;padding:32px;border-radius:16px 16px 0 0;">
          <p style="color:#F7A800;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Fort Hays State University · IBTSS 2026</p>
          <h1 style="color:white;margin:0;font-size:22px;">Confirm Your Passport</h1>
        </div>
        <div style="padding:32px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
          <p style="color:#334155;">Hi ${name},</p>
          <p style="color:#334155;">Click the button below to confirm this email and activate your AI Learning Passport. This link expires in 24 hours.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${verifyUrl}" style="background:#F7A800;color:#000000;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">
              Confirm My Passport
            </a>
          </div>
          <p style="color:#94a3b8;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
}

export async function sendDeviceConfirmLink(email: string, name: string, confirmUrl: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirm this device for your IBTSS 2026 AI Learning Passport",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#000000;padding:32px;border-radius:16px 16px 0 0;">
          <p style="color:#F7A800;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Fort Hays State University · IBTSS 2026</p>
          <h1 style="color:white;margin:0;font-size:22px;">Confirm This Device</h1>
        </div>
        <div style="padding:32px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
          <p style="color:#334155;">Hi ${name},</p>
          <p style="color:#334155;">Someone just tried to sign in to your AI Learning Passport from a new device or browser. If that was you, click below to confirm and continue. This link expires in 15 minutes.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${confirmUrl}" style="background:#F7A800;color:#000000;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">
              Confirm This Device
            </a>
          </div>
          <p style="color:#94a3b8;font-size:12px;">If this wasn't you, you can safely ignore this email — your passport stays untouched.</p>
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
        <div style="background:#000000;padding:32px;border-radius:16px 16px 0 0;">
          <p style="color:#F7A800;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Fort Hays State University · IBTSS 2026</p>
          <h1 style="color:white;margin:0;font-size:28px;">Passport Complete! 🎉</h1>
        </div>
        <div style="padding:32px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
          <p style="color:#334155;">Congratulations, ${name}!</p>
          <p style="color:#334155;">You've visited all three IBTSS workshop stations and earned your Digital Passport completion badge.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${passportUrl}" style="background:#F7A800;color:#000000;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">
              View & Share My Passport
            </a>
          </div>
          <p style="color:#334155;font-size:13px;line-height:1.6;">
            Your digital badge is issued after the workshop team processes completions — you'll get a separate email from Credly when it's ready. In the meantime, here's
            <a href="${BASE_URL}/Credly%20Badges%20at%20FHSU%20-%20Earner%20Experience.pdf" style="color:#8A6A00;font-weight:700;">how to claim it on Credly</a>.
          </p>
          <p style="color:#94a3b8;font-size:12px;">Share your achievement on LinkedIn to inspire others and promote AI literacy at FHSU!</p>
        </div>
      </div>
    `,
  });
}
