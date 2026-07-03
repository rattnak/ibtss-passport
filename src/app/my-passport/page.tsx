"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LogIn } from "lucide-react";
import { useSession } from "@/lib/session";

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1.5px solid #CCCCCC", borderRadius: 12,
  padding: "12px 14px", fontSize: 16, color: "#1a1a1a",
  background: "white", fontFamily: "inherit",
};

export default function MyPassportPage() {
  const router = useRouter();
  const { email, participantId, signIn, openSignIn } = useSession();

  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Signed in → straight to the passport
  useEffect(() => {
    if (participantId) router.replace(`/passport/${participantId}`);
  }, [participantId, router]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: regEmail }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Something went wrong."); setLoading(false); return; }
    await signIn(regEmail);
    router.push(`/passport/${data.id}`);
  }

  if (participantId) {
    return (
      <main className="min-h-full flex items-center justify-center px-4" style={{ background: "white" }}>
        <p role="status" style={{ fontSize: 14, color: "#666" }}>Opening your passport…</p>
      </main>
    );
  }

  return (
    <main className="min-h-full flex flex-col items-center px-4 py-10" style={{ background: "white" }}>
      <div className="w-full" style={{ maxWidth: 420 }}>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(247,168,0,0.16)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <BookOpen size={28} color="var(--gold-text)" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 8 }}>
            AI Learning Passport
          </h1>
          <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6 }}>
            One registration covers everything: station stamps, toolkit worksheets, and your shareable completion passport.
          </p>
        </div>

        {/* Sign in (returning) */}
        <button
          onClick={openSignIn}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", minHeight: 52,
            background: "var(--fhsu-black)", color: "var(--fhsu-gold)",
            border: "none", borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            marginBottom: 18,
          }}
        >
          <LogIn size={16} aria-hidden="true" /> Already registered? Sign in
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }} aria-hidden="true">
          <span style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#999", textTransform: "uppercase" }}>or register</span>
          <span style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
        </div>

        {/* Register (new) */}
        <div style={{
          background: "white", borderRadius: 18, padding: "24px 22px",
          border: "1px solid #E8E8E8", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label htmlFor="reg-name" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 6 }}>
                Full Name
              </label>
              <input
                id="reg-name" type="text" required value={name} autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith" style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="reg-email" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                id="reg-email" type="email" required value={regEmail} autoComplete="email"
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="jane@fhsu.edu" style={inputStyle}
              />
            </div>

            {error && <p role="alert" style={{ fontSize: 13, color: "#B3261E" }}>{error}</p>}

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", minHeight: 50, background: loading ? "#999" : "var(--fhsu-gold)",
                color: "var(--fhsu-black)", border: "none", borderRadius: 14,
                fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", marginTop: 4,
              }}
            >
              {loading ? "Starting…" : "Start My Passport →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
