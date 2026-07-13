"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LogIn, UserPlus } from "lucide-react";
import { useSession } from "@/lib/session";

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1.5px solid #CCCCCC", borderRadius: 12,
  padding: "12px 14px", fontSize: 16, color: "#1a1a1a",
  background: "white", fontFamily: "inherit",
};

const errorInputStyle: React.CSSProperties = {
  ...inputStyle,
  border: "1.5px solid #D32F2F",
};

export default function MyPassportPage() {
  const router = useRouter();
  const { participantId, signIn } = useSession();

  const [mode, setMode] = useState<"signin" | "register">("signin");

  // Sign in
  const [signInEmail, setSignInEmail] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [signInShake, setSignInShake] = useState(false);

  // Register
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regShake, setRegShake] = useState(false);

  // Signed in → straight to the passport
  useEffect(() => {
    if (participantId) router.replace(`/passport/${participantId}`);
  }, [participantId, router]);

  function shakeIt(setShake: (v: boolean) => void) {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!signInEmail.trim()) {
      setSignInError("Enter the email you registered with.");
      shakeIt(setSignInShake);
      return;
    }
    setSignInLoading(true);
    setSignInError("");
    const result = await signIn(signInEmail);
    setSignInLoading(false);
    if (!result.ok) {
      setSignInError(result.error ?? "Something went wrong.");
      shakeIt(setSignInShake);
      return;
    }
    router.push(`/passport/${participantId}`);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !regEmail.trim()) {
      setRegError("Fill in your name and email to continue.");
      shakeIt(setRegShake);
      return;
    }
    setRegLoading(true);
    setRegError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: regEmail }),
    });
    const data = await res.json();
    if (!res.ok) {
      setRegError(data.error ?? "Something went wrong.");
      setRegLoading(false);
      shakeIt(setRegShake);
      return;
    }
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

        {/* Mode toggle */}
        <div role="tablist" aria-label="Sign in or register" style={{
          display: "flex", background: "#F2F2F2", borderRadius: 14, padding: 4, marginBottom: 20, gap: 4,
        }}>
          <button
            role="tab" aria-selected={mode === "signin"} onClick={() => setMode("signin")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              minHeight: 44, border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              fontSize: 13.5, fontWeight: 700,
              background: mode === "signin" ? "white" : "transparent",
              color: mode === "signin" ? "var(--fhsu-black)" : "#777",
              boxShadow: mode === "signin" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            <LogIn size={15} aria-hidden="true" /> Sign In
          </button>
          <button
            role="tab" aria-selected={mode === "register"} onClick={() => setMode("register")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              minHeight: 44, border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              fontSize: 13.5, fontWeight: 700,
              background: mode === "register" ? "white" : "transparent",
              color: mode === "register" ? "var(--fhsu-black)" : "#777",
              boxShadow: mode === "register" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            <UserPlus size={15} aria-hidden="true" /> Register
          </button>
        </div>

        {mode === "signin" ? (
          <div
            className={signInShake ? "shake" : ""}
            style={{
              background: "white", borderRadius: 18, padding: "24px 22px",
              border: signInError ? "1.5px solid #D32F2F" : "1px solid #E8E8E8",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
              Use the email you registered your passport with.
            </p>
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label htmlFor="signin-email" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  id="signin-email" type="email" required value={signInEmail} autoComplete="email"
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="jane@fhsu.edu"
                  style={signInError ? errorInputStyle : inputStyle}
                  aria-invalid={!!signInError}
                />
              </div>

              {signInError && (
                <p role="alert" style={{ fontSize: 13, color: "#D32F2F", lineHeight: 1.5 }}>
                  {signInError}{" "}
                  <button type="button" onClick={() => setMode("register")} style={{ color: "var(--fhsu-black)", fontWeight: 700, background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "underline", fontSize: 13, fontFamily: "inherit" }}>
                    Register instead →
                  </button>
                </p>
              )}

              <button
                type="submit" disabled={signInLoading}
                style={{
                  width: "100%", minHeight: 50, background: signInLoading ? "#999" : "var(--fhsu-gold)",
                  color: "var(--fhsu-black)", border: "none", borderRadius: 14,
                  fontSize: 15, fontWeight: 700, cursor: signInLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit", marginTop: 4,
                }}
              >
                {signInLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        ) : (
          <div
            className={regShake ? "shake" : ""}
            style={{
              background: "white", borderRadius: 18, padding: "24px 22px",
              border: regError ? "1.5px solid #D32F2F" : "1px solid #E8E8E8",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label htmlFor="reg-name" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 6 }}>
                  Full Name
                </label>
                <input
                  id="reg-name" type="text" required value={name} autoComplete="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  style={regError ? errorInputStyle : inputStyle}
                  aria-invalid={!!regError}
                />
              </div>
              <div>
                <label htmlFor="reg-email" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 6 }}>
                  Email Address
                </label>
                <input
                  id="reg-email" type="email" required value={regEmail} autoComplete="email"
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="jane@fhsu.edu"
                  style={regError ? errorInputStyle : inputStyle}
                  aria-invalid={!!regError}
                />
              </div>

              {regError && <p role="alert" style={{ fontSize: 13, color: "#D32F2F" }}>{regError}</p>}

              <button
                type="submit" disabled={regLoading}
                style={{
                  width: "100%", minHeight: 50, background: regLoading ? "#999" : "var(--fhsu-gold)",
                  color: "var(--fhsu-black)", border: "none", borderRadius: 14,
                  fontSize: 15, fontWeight: 700, cursor: regLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit", marginTop: 4,
                }}
              >
                {regLoading ? "Starting…" : "Start My Passport →"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
