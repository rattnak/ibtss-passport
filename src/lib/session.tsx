"use client";

// Lightweight participant session: sign in once with the passport email,
// and every worksheet/check-in records under it. Persisted in localStorage.

import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
} from "react";
import Link from "next/link";
import { X } from "lucide-react";

type Session = {
  email: string | null;
  name: string | null;
  participantId: string | null;
  signIn: (email: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  openSignIn: () => void;
};

const SessionContext = createContext<Session>({
  email: null, name: null, participantId: null,
  signIn: async () => ({ ok: false }),
  signOut: () => {},
  openSignIn: () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore session
  useEffect(() => {
    try {
      const e = localStorage.getItem("ibtss_email");
      const n = localStorage.getItem("ibtss_name");
      const i = localStorage.getItem("ibtss_participant_id");
      if (e) { setEmail(e); setName(n); setParticipantId(i); }
    } catch {}
  }, []);

  const signIn = useCallback(async (rawEmail: string) => {
    const clean = rawEmail.toLowerCase().trim();
    const res = await fetch(`/api/participant-by-email?email=${encodeURIComponent(clean)}`);
    if (!res.ok) {
      return { ok: false, error: "No passport found for this email. Please register first on the Agenda page." };
    }
    const data = await res.json();
    setEmail(clean);
    setName(data.name ?? null);
    setParticipantId(data.id ?? null);
    try {
      localStorage.setItem("ibtss_email", clean);
      if (data.name) localStorage.setItem("ibtss_name", data.name);
      if (data.id) localStorage.setItem("ibtss_participant_id", data.id);
    } catch {}
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setEmail(null); setName(null); setParticipantId(null);
    try {
      localStorage.removeItem("ibtss_email");
      localStorage.removeItem("ibtss_name");
      localStorage.removeItem("ibtss_participant_id");
    } catch {}
  }, []);

  const openSignIn = useCallback(() => {
    setError("");
    setModalOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn(input);
    setLoading(false);
    if (!result.ok) { setError(result.error ?? "Something went wrong."); return; }
    setModalOpen(false);
    setInput("");
  }

  // Close on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  return (
    <SessionContext.Provider value={{ email, name, participantId, signIn, signOut, openSignIn }}>
      {children}

      {modalOpen && (
        <div
          role="presentation"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
        >
          <div
            role="dialog" aria-modal="true" aria-labelledby="signin-title"
            style={{
              background: "white", borderRadius: 16, padding: "24px 22px",
              width: "100%", maxWidth: 380, boxShadow: "0 12px 48px rgba(0,0,0,0.25)",
              borderTop: "4px solid var(--fhsu-gold)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <h2 id="signin-title" style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 19, fontWeight: 700, color: "var(--fhsu-black)" }}>
                Sign in
              </h2>
              <button
                onClick={() => setModalOpen(false)} aria-label="Close sign-in dialog"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 8, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={18} color="#555" aria-hidden="true" />
              </button>
            </div>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
              Use the email you registered your passport with. Your worksheets and stamps will be recorded under it.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label htmlFor="signin-email" style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  id="signin-email" ref={inputRef} type="email" required value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="jane@fhsu.edu" autoComplete="email"
                  style={{
                    width: "100%", border: "1.5px solid #CCCCCC", borderRadius: 12,
                    padding: "12px 14px", fontSize: 16, color: "#1a1a1a",
                    background: "white", fontFamily: "inherit",
                  }}
                />
              </div>
              {error && (
                <p role="alert" style={{ fontSize: 13, color: "#B3261E", lineHeight: 1.5 }}>
                  {error}{" "}
                  <Link href="/" onClick={() => setModalOpen(false)} style={{ color: "var(--fhsu-black)", fontWeight: 700 }}>
                    Register →
                  </Link>
                </p>
              )}
              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", minHeight: 48, background: loading ? "#999" : "var(--fhsu-gold)",
                  color: "var(--fhsu-black)", border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      )}
    </SessionContext.Provider>
  );
}
