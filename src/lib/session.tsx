"use client";

// Lightweight participant session: sign in once with the passport email,
// and every worksheet/check-in records under it. Persisted in localStorage.
// Sign-in is a full page (/my-passport), not a modal — openSignIn() navigates there.

import {
  createContext, useCallback, useContext, useEffect, useState,
} from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);

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
      return { ok: false, error: "No passport found for this email. Please register below." };
    }
    const data = await res.json();
    if (!data.verified) {
      return {
        ok: false,
        error: "Please confirm your email first — check your inbox for the link we sent when you registered.",
      };
    }
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
    router.push("/my-passport");
  }, [router]);

  return (
    <SessionContext.Provider value={{ email, name, participantId, signIn, signOut, openSignIn }}>
      {children}
    </SessionContext.Provider>
  );
}
