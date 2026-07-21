"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft, ExternalLink, PenLine, BookOpen, CheckCircle2,
  CloudUpload, Check, LogIn, Gift,
} from "lucide-react";
import { getToolkitSection, ToolkitBlock, ToolkitField } from "@/lib/toolkit";
import { isWorkshopOver } from "@/lib/agenda";
import { useSession } from "@/lib/session";

type Responses = Record<string, string | string[]>;

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1.5px solid #CCCCCC", borderRadius: 12,
  padding: "12px 14px", fontSize: 16, color: "#1a1a1a",
  background: "white", fontFamily: "inherit", lineHeight: 1.5,
};

function FieldInput({ field, value, onChange }: {
  field: ToolkitField;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
}) {
  const id = `field-${field.key}`;
  if (field.type === "text") {
    return (
      <input id={id} type="text" value={(value as string) ?? ""} placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea id={id} value={(value as string) ?? ""} placeholder={field.placeholder} rows={field.rows ?? 3}
        onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
    );
  }
  if (field.type === "scale") {
    const current = Number(value) || 0;
    return (
      <div role="group" aria-label={field.label}>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => onChange(String(n))}
              aria-pressed={current === n}
              aria-label={`${n} out of 5`}
              style={{
                flex: 1, minHeight: 46, borderRadius: 10, fontFamily: "inherit",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                border: current === n ? "2px solid var(--fhsu-gold)" : "1.5px solid #CCCCCC",
                background: current === n ? "rgba(247,168,0,0.16)" : "white",
                color: "var(--fhsu-black)",
              }}>{n}</button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11.5, color: "#767676" }}>{field.low}</span>
          <span style={{ fontSize: 11.5, color: "#767676" }}>{field.high}</span>
        </div>
      </div>
    );
  }
  // choice
  const selected = field.multi
    ? (Array.isArray(value) ? value : [])
    : [(value as string) ?? ""];
  return (
    <div role="group" aria-label={field.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {field.options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button key={opt} type="button"
            aria-pressed={active}
            onClick={() => {
              if (field.multi) {
                onChange(active ? selected.filter((s) => s !== opt) : [...selected, opt]);
              } else {
                onChange(opt);
              }
            }}
            style={{
              display: "flex", alignItems: "center", gap: 10, textAlign: "left",
              padding: "12px 14px", minHeight: 46, borderRadius: 10, fontFamily: "inherit",
              fontSize: 13.5, lineHeight: 1.4, cursor: "pointer",
              border: active ? "2px solid var(--fhsu-gold)" : "1.5px solid #CCCCCC",
              background: active ? "rgba(247,168,0,0.14)" : "white",
              color: "var(--fhsu-black)",
              fontWeight: active ? 700 : 400,
            }}>
            <span aria-hidden="true" style={{
              width: 18, height: 18, borderRadius: field.multi ? 5 : "50%", flexShrink: 0,
              border: active ? "none" : "1.5px solid #999",
              background: active ? "var(--fhsu-gold)" : "white",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {active && <Check size={12} color="var(--fhsu-black)" strokeWidth={3} />}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Block({ block, responses, onField }: {
  block: ToolkitBlock;
  responses: Responses;
  onField: (key: string, v: string | string[]) => void;
}) {
  switch (block.kind) {
    case "heading":
      return (
        <h2 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 19, fontWeight: 700, color: "var(--fhsu-black)", marginTop: 10, paddingBottom: 6, borderBottom: "2px solid var(--fhsu-gold)" }}>
          {block.text}
        </h2>
      );
    case "paragraph":
      return <p style={{ fontSize: 14, color: "#333", lineHeight: 1.7 }}>{block.text}</p>;
    case "quote":
      return (
        <blockquote style={{
          background: "var(--fhsu-black)", borderRadius: 12, padding: "16px 18px",
          fontSize: 13.5, color: "rgba(255,255,255,0.9)", lineHeight: 1.7,
          fontStyle: "italic", borderLeft: "4px solid var(--fhsu-gold)",
          whiteSpace: "pre-wrap",
        }}>
          {block.text}
        </blockquote>
      );
    case "list":
      return (
        <ul style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 0, listStyle: "none" }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "#333", lineHeight: 1.6 }}>
              <CheckCircle2 size={15} color="var(--gold-text)" strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }} />
              {item}
            </li>
          ))}
        </ul>
      );
    case "links":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {block.links.map((link) => (
            <a key={link.url + link.title} href={link.url} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              background: "white", border: "1px solid #E0E0E0", borderRadius: 12,
              padding: "12px 14px", textDecoration: "none", minHeight: 46,
            }}>
              <ExternalLink size={14} color="var(--gold-text)" strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }} />
              <span>
                <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--fhsu-black)", lineHeight: 1.4 }}>{link.title}</span>
                {link.note && <span style={{ display: "block", fontSize: 12, color: "#666", marginTop: 2, lineHeight: 1.5 }}>{link.note}</span>}
              </span>
            </a>
          ))}
        </div>
      );
    case "field":
      return (
        <div>
          <label htmlFor={`field-${block.field.key}`} style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--fhsu-black)", marginBottom: 8, lineHeight: 1.5 }}>
            {block.field.label}
          </label>
          <FieldInput field={block.field} value={responses[block.field.key]} onChange={(v) => onField(block.field.key, v)} />
        </div>
      );
  }
}

export default function ToolkitSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = getToolkitSection(sectionId);
  const { email, name, openSignIn } = useSession();

  const [loaded, setLoaded] = useState(false);
  // Post-workshop section is time-gated: locked until the session ends.
  // Facilitator bypass: append ?preview=1 to the URL (documented in README).
  const [postUnlocked, setPostUnlocked] = useState(false);
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("preview") === "1";
    setPostUnlocked(isWorkshopOver() || preview);
  }, []);
  const [responses, setResponses] = useState<Responses>({});
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<Responses>({});

  // Load saved responses once signed in
  useEffect(() => {
    if (!section?.interactive || !email) { setLoaded(false); return; }
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/toolkit?email=${encodeURIComponent(email)}&section=${section.id}`);
      if (cancelled) return;
      if (res.ok) {
        const data = await res.json();
        latest.current = data.responses ?? {};
        setResponses(latest.current);
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [email, section]);

  const scheduleSave = useCallback(() => {
    if (!email || !section) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(async () => {
      const res = await fetch("/api/toolkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, section: section.id, responses: latest.current }),
      });
      setSaveState(res.ok ? "saved" : "idle");
    }, 900);
  }, [email, section]);

  const onField = useCallback((key: string, v: string | string[]) => {
    latest.current = { ...latest.current, [key]: v };
    setResponses(latest.current);
    scheduleSave();
  }, [scheduleSave]);

  if (!section) {
    return (
      <main className="min-h-full flex items-center justify-center px-4" style={{ background: "white" }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <p style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 20, color: "var(--fhsu-black)", marginBottom: 8 }}>Section Not Found</p>
          <Link href="/toolkit" style={{ color: "var(--gold-text)", fontWeight: 700, fontSize: 14 }}>← Back to Toolkit</Link>
        </div>
      </main>
    );
  }

  // Time gate: post-workshop resources are only accessible after the session ends
  if (section.id === "post-workshop" && !postUnlocked) {
    return (
      <main className="min-h-full flex items-center justify-center px-4" style={{ background: "white" }}>
        <div style={{ textAlign: "center", maxWidth: 340 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <BookOpen size={26} color="#999" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 8 }}>
            Not yet — enjoy the workshop!
          </h1>
          <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
            Post-workshop resources unlock when the session ends on August 5 at 5:00 PM.
          </p>
          <Link href="/toolkit" style={{ color: "var(--gold-text)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            ← Back to Toolkit
          </Link>
        </div>
      </main>
    );
  }

  // Post-workshop: same design, header, and description style as the Participant Toolkit index —
  // left-aligned title/intro, uppercase group labels, card-grid of link cards.
  if (section.id === "post-workshop") {
    return (
      <main className="min-h-full flex flex-col items-center px-4 pt-4 pb-8" style={{ background: "white" }}>
        <div className="page-container">
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, minHeight: 44 }}>
            <ChevronLeft size={15} color="#666" strokeWidth={2} aria-hidden="true" />
            <Link href="/" style={{ color: "#666", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Agenda
            </Link>
            <span aria-hidden="true" style={{ color: "#BBB", fontSize: 13 }}>/</span>
            <Link href="/toolkit" style={{ color: "#666", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Toolkit
            </Link>
            <span aria-hidden="true" style={{ color: "#BBB", fontSize: 13 }}>/</span>
            <span aria-current="page" style={{ color: "var(--gold-text)", fontSize: 13, fontWeight: 700 }}>
              Post-Workshop
            </span>
          </nav>

          <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 8 }}>
            {section.title}
          </h1>
          <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, marginBottom: 24 }}>
            {section.intro}
          </p>

          {section.blocks.map((block, i) => {
            if (block.kind === "heading") {
              return (
                <h2 key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--gold-text)", margin: "24px 0 10px" }}>
                  {block.text}
                </h2>
              );
            }
            if (block.kind === "links") {
              return (
                <div key={i} className="card-grid">
                  {block.links.map((link) => (
                    <a key={link.url + link.title} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "flex", alignItems: "center", gap: 12,
                      background: "white",
                      border: "1px solid #E8E8E8",
                      borderLeft: "4px solid var(--fhsu-gold)",
                      borderRadius: 12, padding: "13px 14px", minHeight: 64, textDecoration: "none",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: "rgba(247,168,0,0.16)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <ExternalLink size={16} color="var(--gold-text)" strokeWidth={2} aria-hidden="true" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--fhsu-black)", lineHeight: 1.3 }}>{link.title}</p>
                        {link.note && <p style={{ fontSize: 11, color: "#767676", marginTop: 2, lineHeight: 1.45 }}>{link.note}</p>}
                      </div>
                    </a>
                  ))}
                </div>
              );
            }
            if (block.kind === "paragraph") {
              return (
                <p key={i} style={{ fontSize: 13, color: "#767676", lineHeight: 1.6, marginTop: 24 }}>
                  {block.text}
                </p>
              );
            }
            return null;
          })}
        </div>
      </main>
    );
  }

  const needsSignIn = section.interactive && !email;

  return (
    <main className="min-h-full flex flex-col items-center px-4 pt-4 pb-8" style={{ background: "white" }}>
      <div className="page-container" style={{ display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Header — consistent with Stations / Toolkit / Post-Workshop */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <Link href="/toolkit" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#666", fontSize: 13, textDecoration: "none", minHeight: 44 }}>
            <ChevronLeft size={15} strokeWidth={2} aria-hidden="true" /> Toolkit
          </Link>
          {section.interactive && email && (
            <span role="status" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: saveState === "saved" ? "#1E7167" : "#767676" }}>
              {saveState === "saving"
                ? <><CloudUpload size={13} strokeWidth={2} aria-hidden="true" /> Saving…</>
                : saveState === "saved"
                  ? <><Check size={13} strokeWidth={2.5} aria-hidden="true" /> Saved</>
                  : <><CheckCircle2 size={13} strokeWidth={2} aria-hidden="true" /> Autosave on</>}
            </span>
          )}
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(247,168,0,0.16)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            {section.id === "post-workshop"
              ? <Gift size={26} color="var(--gold-text)" strokeWidth={1.8} aria-hidden="true" />
              : section.interactive
                ? <PenLine size={26} color="var(--gold-text)" strokeWidth={1.8} aria-hidden="true" />
                : <BookOpen size={26} color="var(--gold-text)" strokeWidth={1.8} aria-hidden="true" />}
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--gold-text)", marginBottom: 6 }}>
            {section.source}{section.interactive ? " · fill-in worksheet" : ""}
          </p>
          <h1 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--fhsu-black)", marginBottom: 8, lineHeight: 1.2 }}>
            {section.title}
          </h1>
          <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
            {section.intro}
          </p>
          {email && name && section.interactive && (
            <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>Responses saved for {name}</p>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, paddingBottom: 24 }}>
          {needsSignIn ? (
            <div style={{ background: "#FAFAFA", borderRadius: 16, padding: "28px 22px", border: "1px solid #E5E5E5", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(247,168,0,0.16)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <PenLine size={24} color="var(--gold-text)" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h2 style={{ fontFamily: "'Barlow Condensed', 'Barlow', sans-serif", fontSize: 19, color: "var(--fhsu-black)", fontWeight: 700, marginBottom: 6 }}>
                Sign in to fill this worksheet
              </h2>
              <p style={{ fontSize: 13.5, color: "#666", marginBottom: 20, lineHeight: 1.6 }}>
                Your answers are recorded under your registered email and save automatically as you type.
              </p>
              <button
                onClick={openSignIn}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "var(--fhsu-gold)", color: "var(--fhsu-black)",
                  border: "none", borderRadius: 12, padding: "13px 26px", minHeight: 48,
                  fontSize: 14.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <LogIn size={15} aria-hidden="true" /> Sign In
              </button>
              <p style={{ fontSize: 12.5, color: "#888", marginTop: 16 }}>
                No passport yet? <Link href="/" style={{ color: "var(--gold-text)", fontWeight: 700 }}>Register here</Link>
              </p>
            </div>
          ) : section.interactive && !loaded ? (
            <p role="status" style={{ textAlign: "center", fontSize: 13.5, color: "#767676", padding: "30px 0" }}>Loading your worksheet…</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} responses={responses} onField={onField} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
