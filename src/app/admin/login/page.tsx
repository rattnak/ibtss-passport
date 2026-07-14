"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, MailCheck } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1.5px solid #CCCCCC", borderRadius: 12,
  padding: "12px 14px", fontSize: 16, color: "#1a1a1a",
  background: "white", fontFamily: "inherit",
};

const errorInputStyle: React.CSSProperties = { ...inputStyle, border: "1.5px solid #D32F2F" };

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const params = useSearchParams();
  const linkError = params.get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(linkError ?? "");
  const [shake, setShake] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your email address.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setLoading(true);
    setError("");
    await fetch("/api/admin/request-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <main className="min-h-full flex flex-col items-center justify-center px-4 py-10" style={{ background: "white" }}>
      <div className="w-full" style={{ maxWidth: 420 }}>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(247,168,0,0.16)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <ShieldCheck size={28} color="var(--gold-text)" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 8 }}>
            Admin Sign-In
          </h1>
          <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6 }}>
            Station QR codes are restricted to authorized facilitators. Enter your email to receive a one-time sign-in link.
          </p>
        </div>

        {sent ? (
          <div style={{
            background: "white", borderRadius: 18, padding: "28px 22px", textAlign: "center",
            border: "1px solid #E8E8E8", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            <MailCheck size={32} color="var(--gold-text)" strokeWidth={1.8} aria-hidden="true" style={{ margin: "0 auto 14px" }} />
            <h2 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 19, color: "var(--fhsu-black)", fontWeight: 700, marginBottom: 6 }}>
              Check your inbox
            </h2>
            <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>
              If <strong>{email}</strong> is authorized for admin access, a sign-in link is on its way. It expires in 15 minutes.
            </p>
          </div>
        ) : (
          <div
            className={shake ? "shake" : ""}
            style={{
              background: "white", borderRadius: 18, padding: "24px 22px",
              border: error ? "1.5px solid #D32F2F" : "1px solid #E8E8E8",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label htmlFor="admin-email" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  id="admin-email" type="email" required value={email} autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@fhsu.edu"
                  style={error ? errorInputStyle : inputStyle}
                  aria-invalid={!!error}
                />
              </div>

              {error && <p role="alert" style={{ fontSize: 13, color: "#D32F2F", lineHeight: 1.5 }}>{error}</p>}

              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", minHeight: 50, background: loading ? "#999" : "var(--fhsu-gold)",
                  color: "var(--fhsu-black)", border: "none", borderRadius: 14,
                  fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit", marginTop: 4,
                }}
              >
                {loading ? "Sending…" : "Send Sign-In Link"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
