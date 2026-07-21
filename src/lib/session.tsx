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
  signIn: (email: string) => Promise<{ ok: boolean; error?: string; unverified?: boolean }>;
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

type SessionState = {
  email: string | null;
  name: string | null;
  participantId: string | null;
};

const SIGNED_OUT: SessionState = { email: null, name: null, participantId: null };

function clearStoredSession() {
  try {
    localStorage.removeItem("ibtss_email");
    localStorage.removeItem("ibtss_name");
    localStorage.removeItem("ibtss_participant_id");
  } catch {}
}

function readStoredSession(): SessionState {
  try {
    const email = localStorage.getItem("ibtss_email");
    if (!email) return SIGNED_OUT;
    return {
      email,
      name: localStorage.getItem("ibtss_name"),
      participantId: localStorage.getItem("ibtss_participant_id"),
    };
  } catch {
    return SIGNED_OUT;
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Must start signed-out (matching what the server renders, since
  // localStorage doesn't exist there) — a lazy useState initializer runs
  // during the client's first render too, which React then diffs against
  // the server HTML during hydration and treats as a mismatch if it
  // differs. Restoring inside an effect instead means this render happens
  // strictly after hydration, so it never gets compared to server output.
  const [state, setState] = useState<SessionState>(SIGNED_OUT);

  // Restore the cached session, then re-check it against the database — a
  // locally cached session can outlive the participant it points to
  // (deleted, re-registered, never verified), which would otherwise show a
  // name in the navbar for an account that no other page can actually find.
  useEffect(() => {
    const restored = readStoredSession();
    if (!restored.email) return;
    setState(restored);

    fetch(`/api/participant-by-email?email=${encodeURIComponent(restored.email)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const stillValid = data && data.verified && data.id === restored.participantId;
        if (stillValid) return;
        setState(SIGNED_OUT);
        clearStoredSession();
      })
      .catch(() => {}); // offline/network error — keep the cached session rather than sign out
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
        unverified: true,
        error: "Please confirm your email first — check your inbox for the link we sent when you registered.",
      };
    }
    setState({ email: clean, name: data.name ?? null, participantId: data.id ?? null });
    try {
      localStorage.setItem("ibtss_email", clean);
      if (data.name) localStorage.setItem("ibtss_name", data.name);
      if (data.id) localStorage.setItem("ibtss_participant_id", data.id);
    } catch {}
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setState(SIGNED_OUT);
    clearStoredSession();
  }, []);

  const openSignIn = useCallback(() => {
    router.push("/my-passport");
  }, [router]);

  return (
    <SessionContext.Provider value={{ ...state, signIn, signOut, openSignIn }}>
      {children}
    </SessionContext.Provider>
  );
}
